<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Annotation;

use App\Traits\HasCompositePrimaryKey;

class Book extends Model
{
    use HasFactory;
    use HasCompositePrimaryKey;

    protected $primaryKey = ['isbn', 'user_id'];    public $incrementing = false;
    protected $fillable = [
        'isbn',
        'user_id', // Add 'user_id' to the $fillable array
        'title',
        'author',
        'publisher',
        'language',
        'thumbnail',
        'description',
        'file_directory',
        'rating',
        'genre',
    ];

    protected $casts = [
        'isbn' => 'string', // Ensure isbn is casted as a string
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function annotations()
    {
        return $this->hasMany(Annotation::class, 'book_isbn', 'isbn');
    }
}
