<x-filament-panels::page>
    {{ $this->sessionInfolist }}

    @php
        // Helper function pour extraire le nom du fichier
       $getFileName = function($path) {
           // Enlève le chemin du dossier
           return basename($path);
       };

       $isAudioFile = function($url) {
           $extensions = ['.wav', '.mp3', '.ogg', '.m4a', '.aac'];
           $url = strtolower($url);
           return collect($extensions)->contains(function($ext) use ($url) {
               return str_ends_with($url, $ext);
           });
       }
    @endphp

        <!-- Notes de l'examinateur -->
    @if ($session->notes)
        <div class="-mt-2">
            <div class="bg-white rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-6">
                <h2 class="text-lg font-medium mb-4">Notes de l'examinateur</h2>
                <div class="prose dark:prose-invert max-w-none">
                    {{ $session->notes }}
                </div>
            </div>
        </div>
    @endif

    <!-- Groupes -->
    @if (!empty($groups))
        <div class="-mt-2">
            <div x-data="{ expanded: true }" class="bg-white rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <button @click="expanded = !expanded" class="w-full p-6 flex justify-between items-center">
                    <h2 class="text-lg font-medium">Groupes d'éléments</h2>
                    <svg x-bind:class="expanded ? 'rotate-180' : ''" class="w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <div x-show="expanded" class="p-6 pt-0 space-y-8">
                    @foreach ($groups as $group)
                        <div class="border rounded-lg overflow-hidden dark:border-gray-700">
                            <!-- En-tête du groupe -->
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
                                <div class="flex items-center space-x-2">
                                    <h4 class="text-lg font-medium">{{ $group->name }}</h4>
                                    <span class="inline-block w-4 h-4 rounded-full" style="background-color: {{ $group->color }}"></span>
                                </div>
                            </div>

                            <!-- Commentaire du groupe s'il existe -->
                            @if($group->comment)
                                <div class="bg-blue-50 dark:bg-blue-900/30 p-4 border-b border-gray-200 dark:border-gray-600">
                                    <p class="text-sm text-blue-600 dark:text-blue-300">
                                        <span class="font-medium">Commentaire :</span> {{ $group->comment }}
                                    </p>
                                </div>
                            @endif

                            <!-- Grille des médias -->
                            <div class="p-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    @foreach ($group->elements as $element)
                                        <div class="flex flex-col space-y-3">
                                            <!-- Contenu du média -->
                                            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-200 dark:border-gray-700">
                                                @if ($isAudioFile($element->url))
                                                    <audio controls class="w-full">
                                                        <source src="{{ $element->url }}">
                                                        Votre navigateur ne supporte pas l'élément audio.
                                                    </audio>
                                                @else
                                                    <img src="{{ $element->url }}"
                                                         alt="Media {{ $element->id }}"
                                                         class="w-full h-auto rounded-lg" />
                                                @endif
                                                    <!-- Informations du média -->
                                                    <div class="space-y-1 mt-5">
                                                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                                                            Nom : {{ $getFileName($element->url) }}
                                                        </div>
                                                        <div class="text-sm text-gray-500 dark:text-gray-400">
                                                            Position : X={{ number_format($element->x, 2) }}, Y={{ number_format($element->y, 2) }}
                                                        </div>
                                                        @if(isset($element->interactions) && $element->interactions > 0)
                                                            <div class="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                                {{ $element->interactions }} interactions
                                                            </div>
                                                        @endif
                                                    </div>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    @endif
    <!-- Log des actions -->
    @if ($actionsLog->isNotEmpty())
        <div class="-mt-2">
            <div x-data="{ expanded: false }" class="bg-white rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <button @click="expanded = !expanded" class="w-full p-6 flex justify-between items-center">
                    <h2 class="text-lg font-medium">Journal des actions</h2>
                    <svg x-bind:class="expanded ? 'rotate-180' : ''" class="w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <div x-show="expanded" class="p-6 pt-0">
                    <div class="overflow-x-auto">
                        <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                            <tr class="bg-gray-50 dark:bg-gray-700">
                                <th class="px-4 py-2 text-start text-sm font-medium text-gray-500 dark:text-gray-400">Temps</th>
                                <th class="px-4 py-2 text-start text-sm font-medium text-gray-500 dark:text-gray-400">Action</th>
                                <th class="px-4 py-2 text-start text-sm font-medium text-gray-500 dark:text-gray-400">Détails</th>
                            </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                            @foreach ($actionsLog as $action)
                                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {{ $action['time'] }}
                                    </td>
                                    <td class="px-4 py-2 whitespace-nowrap text-sm">
            <span class="px-2 py-1 rounded-full text-xs
                @if($action['type'] === 'move') bg-blue-100 text-blue-800
                @elseif($action['type'] === 'sound') bg-green-100 text-green-800
                @else bg-purple-100 text-purple-800
                @endif">
                @if($action['type'] === 'move')
                    Déplacement
                @elseif($action['type'] === 'sound')
                    Lecture son
                @else
                    Vue image
                @endif
            </span>
                                    </td>
                                    <td class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                        @if($action['type'] === 'move')
                                            Nom : {{ $getFileName($action['id']) }}<br>
                                            Position : X={{ number_format($action['x'], 2) }}, Y={{ number_format($action['y'], 2) }}
                                        @else
                                            Nom : {{ $getFileName($action['id']) }}
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    @endif

</x-filament-panels::page>
