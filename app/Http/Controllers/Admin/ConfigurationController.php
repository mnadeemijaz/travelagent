<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyConfiguration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ConfigurationController extends Controller
{
    public function backup(): StreamedResponse
    {
        $dbName   = config('database.connections.mysql.database');
        $now      = now()->format('Y-m-d_H-i-s');
        $filename = "backup_{$dbName}_{$now}.sql";

        return response()->streamDownload(function () use ($dbName) {
            $tables = DB::select('SHOW TABLES');
            $key    = 'Tables_in_' . $dbName;

            echo "-- Database Backup: {$dbName}\n";
            echo "-- Generated: " . now()->toDateTimeString() . "\n\n";
            echo "SET FOREIGN_KEY_CHECKS=0;\n\n";

            foreach ($tables as $tableObj) {
                $table = $tableObj->$key;

                // DROP + CREATE
                $createRow = DB::select("SHOW CREATE TABLE `{$table}`")[0];
                $createSql = $createRow->{'Create Table'};
                echo "DROP TABLE IF EXISTS `{$table}`;\n";
                echo $createSql . ";\n\n";

                // INSERT rows in chunks
                $rows = DB::table($table)->get();
                if ($rows->isEmpty()) {
                    continue;
                }

                $columns = '`' . implode('`, `', array_keys((array) $rows->first())) . '`';
                $inserts = [];
                foreach ($rows as $row) {
                    $values = array_map(function ($v) {
                        if ($v === null) return 'NULL';
                        return "'" . addslashes((string) $v) . "'";
                    }, (array) $row);
                    $inserts[] = '(' . implode(', ', $values) . ')';
                }

                // Output in batches of 500 rows
                foreach (array_chunk($inserts, 500) as $batch) {
                    echo "INSERT INTO `{$table}` ({$columns}) VALUES\n";
                    echo implode(",\n", $batch) . ";\n";
                }
                echo "\n";
            }

            echo "SET FOREIGN_KEY_CHECKS=1;\n";
        }, $filename, [
            'Content-Type'        => 'application/octet-stream',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:150'],
            'address'      => ['nullable', 'string', 'max:500'],
            'tagline'      => ['nullable', 'string', 'max:200'],
            'phone'        => ['nullable', 'string', 'max:50'],
            'email'        => ['nullable', 'email', 'max:150'],
            'adult_rate'             => ['nullable', 'numeric', 'min:0'],
            'child_rate'             => ['nullable', 'numeric', 'min:0'],
            'infant_rate'            => ['nullable', 'numeric', 'min:0'],
            'sr_rate'                => ['nullable', 'numeric', 'min:0'],
            'makkah_contact1_name'   => ['nullable', 'string', 'max:100'],
            'makkah_contact1_phone'  => ['nullable', 'string', 'max:50'],
            'makkah_contact2_name'   => ['nullable', 'string', 'max:100'],
            'makkah_contact2_phone'  => ['nullable', 'string', 'max:50'],
            'madina_contact1_name'   => ['nullable', 'string', 'max:100'],
            'madina_contact1_phone'  => ['nullable', 'string', 'max:50'],
            'madina_contact2_name'   => ['nullable', 'string', 'max:100'],
            'madina_contact2_phone'  => ['nullable', 'string', 'max:50'],
        ]);

        $config = CompanyConfiguration::instance();
        $config->update($validated);

        return redirect()->route('profile.edit')->with('configSaved', true);
    }
}
