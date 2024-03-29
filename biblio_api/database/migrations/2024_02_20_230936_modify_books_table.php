<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropPrimary('books_id_primary'); // Drop the primary key constraint for 'id'
            $table->string('isbn')->primary(); // Add 'isbn' as the primary key
        });
    }
    
    public function down()
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropPrimary('books_isbn_primary'); // Drop the primary key constraint for 'isbn'
            $table->id()->primary(); // Revert 'id' back as the primary key
        });
    }
    
};
