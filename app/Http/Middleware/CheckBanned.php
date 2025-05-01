<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckBanned
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->is_banned) {
          $banReason = auth()->user()->ban_reason;
            auth()->logout();
            
            return to_route('login')->with('flash', flash('error', 'Váš účet byl zabanován. Důvod: ' . $banReason));
        }

        return $next($request);
    }
}
