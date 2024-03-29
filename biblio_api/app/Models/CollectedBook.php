<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollectedBook extends Model
{
    use HasFactory;

    protected $fillable = [
        'isbn',
        'user_id',
        'collection_id',
    ];

    // Define the relationship with the Collection model
    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }

    // Define the relationship with the Book model
    public function book()
    {
        return $this->belongsTo(Book::class, 'isbn', 'isbn');
    }
}
