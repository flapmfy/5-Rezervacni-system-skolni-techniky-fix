<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class EnsureEmailIsVerified
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->hasVerifiedEmail()) {
            return $request->expectsJson()
                ? abort(403, 'Email není ověřen.')
                : Redirect::route('verification.notice')
                    ->with('flash', flash('error', 'Prosím, ověřte svůj email před pokračováním.'));
        }

        return $next($request);
    }
}
