<?php

namespace App\Console\Commands;

use App\Models\GroupTicketBooking;
use Illuminate\Console\Command;

class CancelExpiredBookings extends Command
{
    protected $signature = 'bookings:cancel-expired';
    protected $description = 'Cancel pending group ticket bookings whose 1-hour payment window has passed';

    public function handle(): void
    {
        $count = GroupTicketBooking::where('status', 'pending')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->update(['status' => 'cancelled']);

        $this->info("Cancelled {$count} expired booking(s).");
    }
}
