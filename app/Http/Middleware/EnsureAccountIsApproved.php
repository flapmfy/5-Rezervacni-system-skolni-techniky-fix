<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class EnsureAccountIsApproved
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user() || $request->user()->approved_at === null) {
            return $request->expectsJson()
                ? abort(403, 'Účet není schválen.')
                : Redirect::route('awaiting-approval')
                    ->with('flash', flash('error', 'Váš účet čeká na schválení administrátorem.'));
        }

        return $next($request);
    }
}
