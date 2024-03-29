<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\CollectedBook;



class Collection extends Model
{
    use HasFactory;
  
    protected $fillable = [
        'collection_name',
        'collection_description',
        'user_id',
    ];

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function books()
    {
        return $this->hasMany(CollectedBook::class, 'collection_id');
    }

    // Define the accessor for books_count
    protected $appends = ['books_count'];

    public function getBooksCountAttribute()
    {
        return $this->books()->count();
    }
}
