<?php

declare(strict_types=1);

return [
    'actions' => 'Actions',
    'manage' => 'Manage sessions',
    'results' => 'View results',
    'statistics' => 'View statistics',
    'details_experiment' => 'Experiment details',
    'edit_experiment' => 'Edit experiment',
    'delete_experiment' => 'Delete experiment',
    'save_experiment' => 'Save experiment',
    'contact_creator' => 'Contact creator',
    'create_experiment' => 'Create an Experiment',
    'contact_principal' => 'Contact the main experimenter',
    'show_experiment' => 'Show experiment',
    'clearFilter' => 'Clear filter',
    'manage_session' => [
        'label' => 'Session',
        'information' => 'Session management',
        'session_link' => 'Experiment link',
        'no_session' => 'No active session',
        'options' => [
            'start' => 'Start',
            'pause' => 'Pause',
            'stop' => 'Stop',
            'test' => 'Test',
        ],
        'start_desc' => 'Activates the session and generates a unique link if one does not already exist. The session becomes accessible to participants.',
        'pause_desc' => 'Temporarily suspends the session. The link remains active, but participants cannot continue the session until it is resumed.',
        'stop_desc' => 'Ends the session and deactivates the link. To reactivate the session, you must restart it, which generates a new link.',
        'test_desc' => 'Activates the session in test mode. The session is accessible to participants, but no results are saved.',
        'success' => 'Session successfully updated'
    ],
    'export_experiment' => [
        'label' => 'Export',
        'json' => 'Export to JSON',
        'xml' => 'Export to XML',
        'desc' => 'Select the format in which you want to export the experiment data.',
        'media_export_info' => 'Exporting media will add all associated media files to the export.',
        'media_info' => 'Including media will add all associated media files to the export.',
        'include_media' => 'Include media',
        'success' => 'Export completed successfully',
    ],
    'delete' => [
        'heading' => 'Definitive deletion',
        'desc_issues_delete' => 'This experiment cannot be discontinued because it is shared or has pending requests.',
        'confirm_delete' => 'To delete this experiment, please enter the code below.',
        'code_confirm' => 'Confirmation code',
        'code' => 'Code',
        'code_fail' => 'Confirmation code is incorrect',
    ],
];