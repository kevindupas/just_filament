<?php

namespace Database\Seeders;

use App\Models\Experiment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ExperimentSeeder extends Seeder
{
    private $imageFiles;
    private $soundFiles;

    public function __construct()
    {
        $this->imageFiles = array_filter(
            glob(base_path('images/*')),
            fn($file) => in_array(pathinfo($file, PATHINFO_EXTENSION), ['jpg', 'png'])
        );

        $this->soundFiles = array_filter(
            glob(base_path('sounds/*')),
            fn($file) => pathinfo($file, PATHINFO_EXTENSION) === 'wav'
        );
    }

    public function run()
    {
        $principalExperimenters = User::role('principal_experimenter')->get();
        $experimentTypes = ['image', 'sound', 'image_sound'];
        $statuses = ['none', 'start', 'pause', 'stop'];

        foreach ($principalExperimenters as $experimenter) {
            // Create 3-5 experiments per experimenter
            $numExperiments = rand(3, 5);

            for ($i = 0; $i < $numExperiments; $i++) {
                $type = $experimentTypes[array_rand($experimentTypes)];
                $status = $statuses[array_rand($statuses)];

                $experiment = Experiment::create([
                    'name' => "Experiment {$experimenter->id}-{$i}",
                    'description' => "Test experiment {$i} created by {$experimenter->name}",
                    'type' => $type,
                    'button_size' => rand(30, 60),
                    'button_color' => '#' . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT),
                    'created_by' => $experimenter->id,
                    'status' => $status,
                    'link' => $status === 'start' ? Str::random(6) : null,
                    'media' => $this->getMediaForType($type)
                ]);

                // Assign some secondary experimenters
                $secondaryExperimenters = User::role('secondary_experimenter')
                    ->where('created_by', $experimenter->id)
                    ->inRandomOrder()
                    ->take(rand(1, 3))
                    ->get();

                foreach ($secondaryExperimenters as $secondary) {
                    $experiment->users()->attach($secondary->id, [
                        'can_configure' => (bool)rand(0, 1),
                        'can_pass' => (bool)rand(0, 1)
                    ]);
                }
            }
        }
    }

    private function getMediaForType(string $type): array
    {
        $media = [];

        switch ($type) {
            case 'image':
                // Select 2-5 random images
                $selectedImages = array_rand($this->imageFiles, rand(2, min(5, count($this->imageFiles))));
                foreach ((array)$selectedImages as $index) {
                    $path = $this->imageFiles[$index];
                    $filename = basename($path);
                    Storage::disk('public')->put("media/{$filename}", file_get_contents($path));
                    $media[] = "media/{$filename}";
                }
                break;

            case 'sound':
                // Select 2-5 random sounds
                $selectedSounds = array_rand($this->soundFiles, rand(2, min(5, count($this->soundFiles))));
                foreach ((array)$selectedSounds as $index) {
                    $path = $this->soundFiles[$index];
                    $filename = basename($path);
                    Storage::disk('public')->put("media/{$filename}", file_get_contents($path));
                    $media[] = "media/{$filename}";
                }
                break;

            case 'image_sound':
                // Select 1-3 of each
                $numEach = rand(1, 3);
                $selectedImages = array_rand($this->imageFiles, min($numEach, count($this->imageFiles)));
                $selectedSounds = array_rand($this->soundFiles, min($numEach, count($this->soundFiles)));

                foreach ((array)$selectedImages as $index) {
                    $path = $this->imageFiles[$index];
                    $filename = basename($path);
                    Storage::disk('public')->put("media/{$filename}", file_get_contents($path));
                    $media[] = "media/{$filename}";
                }

                foreach ((array)$selectedSounds as $index) {
                    $path = $this->soundFiles[$index];
                    $filename = basename($path);
                    Storage::disk('public')->put("media/{$filename}", file_get_contents($path));
                    $media[] = "media/{$filename}";
                }
                break;
        }

        return $media;
    }
}
