<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnnotationsTable extends Migration
{
    public function up()
    {
        Schema::create('annotations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('book_isbn');
            $table->text('text');
            $table->string('color', 20);
            $table->string('cfi_range');
            $table->timestamps();
            $table->foreign('book_isbn')
            ->references('isbn')
            ->on('books')
            ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('annotations');
    }
}
