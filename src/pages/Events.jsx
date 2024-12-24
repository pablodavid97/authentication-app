import { Suspense } from 'react';
import { useLoaderData, json, defer, Await } from 'react-router-dom';

import EventsList from '../components/EventsList';

function EventsPage() {
    const { events } = useLoaderData();

    return (
        <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
            <Await resolve={events}>
                {(loadedEvents) => <EventsList events={loadedEvents} />}
            </Await>
        </Suspense>
    );
}

export default EventsPage;

async function loadEvents() {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/events`
        );

        console.log('url: ', import.meta.env.VITE_BACKEND_URL);

        if (!response.ok) {
            throw json(
                { message: 'Could not fetch events.' },
                { status: response.status }
            );
        }

        const resData = await response.json();
        console.log('res data: ', resData);
        return resData.events;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error; // Re-throw to propagate error to React Router
    }
}

export function loader() {
    return defer({
        events: loadEvents(),
    });
}
