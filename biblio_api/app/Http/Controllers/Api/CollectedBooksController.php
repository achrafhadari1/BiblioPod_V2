<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CollectedBook;
use App\Models\Book;

use Illuminate\Support\Facades\Auth;

class CollectedBooksController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'identifier' => 'required', // Assuming you're sending the book identifier
            'selectedCollections' => 'required|array', // Assuming you're sending an array of selected collection IDs
        ]);

        // Get the identifier and selected collections from the request
        $identifier = $request->input('identifier');
        $selectedCollections = $request->input('selectedCollections');

        try {
            // Get the authenticated user's ID
            $user_id = Auth::id();

            // Loop through the selected collections
            foreach ($selectedCollections as $collectionId) {
                // Create a new CollectedBook entry for each selected collection
                CollectedBook::create([
                    'isbn' => $identifier, // Assuming you're storing the book identifier in the 'isbn' field
                    'user_id' => $user_id,
                    'collection_id' => $collectionId,
                ]);
            }

            return response()->json(['message' => 'Books added to collections successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error adding books to collections', 'error' => $e->getMessage()], 500);
        }
    }

    public function getBookCollections($identifier)
    {
        try {
            // Get the authenticated user's ID
            $user_id = Auth::id();

            // Get the collections that the book with the given identifier belongs to for the authenticated user
            $collections = CollectedBook::where('isbn', $identifier)
                ->where('user_id', $user_id)
                ->with('collection')
                ->get()
                ->pluck('collection');

            return response()->json(['collections' => $collections], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching book collections', 'error' => $e->getMessage()], 500);
        }
    }

    public function getBookDetailsByCollectionId($collectionId)
    {
        \DB::listen(function ($query) {
            \Log::info($query->sql);
            \Log::info($query->bindings);
        });
    
        try {
            // Get the authenticated user's ID
            $user_id = Auth::id();
    
            // Get the book details based on the collection_id for the authenticated user
            $books = CollectedBook::where('collection_id', $collectionId)
                ->whereHas('book', function ($query) use ($user_id) {
                    $query->where('user_id', $user_id);
                })
                ->with('book')
                ->get()
                ->pluck('book');
    
            // Get only the ISBNs of the retrieved books
            $isbnList = $books->pluck('isbn')->toArray();
    
            // Fetch the full book details with user_id and ISBNs
            $bookDetails = Book::whereIn('isbn', $isbnList)
                ->where('user_id', $user_id)
                ->get();
    
            return response()->json(['books' => $bookDetails], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching book details by collection ID', 'error' => $e->getMessage()], 500);
        }
    }
    
    



    public function deleteBook($collectionId, $bookId)
    {
        try {
            // Get the authenticated user's ID
            $user_id = Auth::id();

            // Find the CollectedBook entry
            $collectedBook = CollectedBook::where('collection_id', $collectionId)
                ->where('user_id', $user_id)
                ->where('isbn', $bookId)
                ->first();

            if (!$collectedBook) {
                return response()->json(['message' => 'Collected Book not found'], 404);
            }
\DB::listen(function ($query) {
        \Log::info($query->sql);
        \Log::info($query->bindings);
    });
            // Delete the CollectedBook
            $collectedBook->delete();

            return response()->json(['message' => 'Book deleted from collection successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting book from collection', 'error' => $e->getMessage()], 500);
        }
    }

}
