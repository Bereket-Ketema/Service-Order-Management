import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-4xl font-extrabold tracking-tight">404</h1>
      <p className="text-muted-foreground text-sm">The requested page could not be found.</p>
      <Link to="/">
        <Button variant="default">Return Home</Button>
      </Link>
    </div>
  );
}
