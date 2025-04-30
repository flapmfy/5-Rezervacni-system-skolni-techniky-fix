<?php

use Illuminate\Support\Carbon;

if (! function_exists('flash')) {
    function flash(string $type, string $message): array
    {
        return [
            'type' => $type,
            'message' => $message,
            'timestamp' => now()->timestamp,
        ];
    }
}

if (! function_exists('checkReservationIssues')) {
    function checkReservationIssues($reservation): array
    {
        $issues = [];

        // Convert dates to Carbon instances
        $pickupDate = $reservation['pickup_date'] ? Carbon::parse($reservation['pickup_date']) : null;
        $returnDate = $reservation['return_date'] ? Carbon::parse($reservation['return_date']) : null;
        $startDate = Carbon::parse($reservation['start_date']);
        $endDate = Carbon::parse($reservation['end_date']);

        // Check if not picked up
        if (! $pickupDate) {
            $issues[] = 'Rezervace nebyla vyzvednuta';

            return $issues;
        }

        // Check for late pickup
        $pickupDelay = abs($pickupDate->diffInDays($startDate, false));
        $daysString = getDayString($pickupDelay);

        if ($pickupDelay > 0) {
            $issues[] = 'Pozdní vyzvednutí ('.$pickupDelay.' '.$daysString.')';
        }

        // Check for late return
        if ($returnDate) {
            $returnDelay = abs($returnDate->diffInDays($endDate, false));
            $daysString = getDayString($returnDelay);
            if ($returnDelay > 0) {
                $issues[] = 'Pozdní vracení ('.$returnDelay.' '.$daysString.')';
            }
        } else {
            $issues[] = 'Rezervace nebyla vrácena';
        }

        // Check for damage
        if (
            isset($reservation['equipment_condition_end']) &&
            $reservation['equipment_condition_start'] !== $reservation['equipment_condition_end']
        ) {
            $issues[] = 'Vybavení bylo poškozeno';
        }

        return $issues;
    }

    function getDayString($days)
    {
        $daysString = '';
        if ($days > 4) {
            $daysString = 'dnů';
        } elseif ($days > 1) {
            $daysString = 'dny';
        } else {
            $daysString = 'den';
        }

        return $daysString;
    }
}
