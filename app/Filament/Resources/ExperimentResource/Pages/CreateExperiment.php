<?php

namespace App\Filament\Resources\ExperimentResource\Pages;

use App\Filament\Resources\ExperimentResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CreateExperiment extends CreateRecord
{
    protected static string $resource = ExperimentResource::class;

    protected function handleRecordCreation(array $data): Model
    {
        $data['created_by'] = Auth::user()->id;
        $experiment = parent::handleRecordCreation($data);

        if (!empty($data['user_ids'])) {
            $experiment->users()->sync($data['user_ids']);
        }

        return $experiment;
    }

    protected function afterCreate(): void
    {
        $experiment = $this->record;

        $experiment->link = Str::random(6);
        $experiment->save();
    }
}
