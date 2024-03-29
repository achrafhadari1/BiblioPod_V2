<?php 

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return  new class extends Migration
{
    public function up()
    {
        DB::unprepared('
            CREATE TRIGGER update_collection_updated_at
            AFTER INSERT ON collected_books
            FOR EACH ROW
            BEGIN
                UPDATE collections
                SET updated_at = NOW()
                WHERE id = NEW.collection_id;
            END;
        ');
    }

    public function down()
    {
        DB::unprepared('DROP TRIGGER IF EXISTS update_collection_updated_at');
    }
};
