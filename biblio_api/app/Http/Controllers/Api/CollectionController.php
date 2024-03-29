<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Collection;
use App\Models\CollectedBook;

class CollectionController extends Controller
{

    public function index()
    {
        // Get all collections with the books_count attribute
        $user_id = auth()->id(); // Get the authenticated user's ID
        $collections = Collection::where('user_id', $user_id)
            ->with('books') // Include books relationship if needed
            ->get();
    
        return response()->json(['collections' => $collections], 200);

    }
    public function store(Request $request)
    {
        // Validate request data
        $request->validate([
            'collection_name' => 'required|string|max:255',
            'collection_description' => 'nullable|string',
        ]);

        // Create a new collection
        $collection = new Collection();
        $collection->collection_name = $request->input('collection_name');
        $collection->collection_description = $request->input('collection_description');
        $collection->user_id = auth()->id(); // Assuming you are storing the logged-in user's ID
        $collection->save();

        return response()->json(['message' => 'Collection created successfully', 'collection' => $collection], 201);
    }

    public function getCollectionName($id)
    {
        try {
            $collection = Collection::findOrFail($id);
            return response()->json(['collection' => $collection], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Collection not found', 'error' => $e->getMessage()], 404);
        }
    }
    public function delete($id)
    {
        try {
            // Find the collection
            $collection = Collection::findOrFail($id);

            // Delete associated collected books
            CollectedBook::where('collection_id', $id)->delete();

            // Delete the collection
            $collection->delete();

            return response()->json(['message' => 'Collection deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting collection', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
{
    // Validate request data
    $request->validate([
        'collection_name' => 'required|string|max:255',
        'collection_description' => 'nullable|string',
    ]);

    try {
        // Find the collection
        $collection = Collection::findOrFail($id);

        // Check if the authenticated user owns the collection
        if ($collection->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Update the collection details
        $collection->update([
            'collection_name' => $request->input('collection_name'),
            'collection_description' => $request->input('collection_description'),
        ]);

        return response()->json(['message' => 'Collection updated successfully', 'collection' => $collection], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error updating collection', 'error' => $e->getMessage()], 500);
    }
}


}
