<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('experiment_access_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('experiment_id')->constrained();
            $table->enum('type', ['access', 'results']);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('request_message')->nullable(); // Message de l'utilisateur
            $table->text('response_message')->nullable(); // Réponse de l'expérimentateur
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('experiment_access_requests');
    }
};
