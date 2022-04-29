import { derived, Readable, readable } from 'svelte/store';
import { page } from '$app/stores';
import { fetchEvents } from '$lib/services/events-service';
import { getWorkflowStartedAndCompletedEvents } from '$lib/utilities/get-started-and-completed-events';
import { tsParameterProperty } from '@babel/types';

const emptySet: FetchEventsResponse = {
  events: [],
  eventGroups: [],
};

const createLoading = <T>() => new Promise<T>(() => {});

export const eventHistory = readable<Eventual<FetchEventsResponse>>(
  createLoading<FetchEventsResponse>(),
  (set) => {
    return page.subscribe(($page) => {
      const { namespace, workflow: workflowId, run: runId } = $page.params;
      const reverse = $page.url.searchParams.has('sort');

      fetchEvents({ namespace, workflowId, runId, reverse }).then(set);
    });
  },
);

export const events = derived(
  [eventHistory, page],
  ([$eventHistory, $page]) => {
    const category = $page.url.searchParams.get('category');
    return $eventHistory.then(({ events }) =>
      events.filter((event) => !category || event.category === category),
    );
  },
);

export const eventGroups = derived(
  [eventHistory, page],
  ([$eventHistory, $page]) => {
    const category = $page.url.searchParams.get('category');
    return $eventHistory.then(({ eventGroups }) =>
      eventGroups.filter((event) => !category || event.category === category),
    );
  },
);

export const inputAndResults = derived([events], ([$events]) => {
  return getWorkflowStartedAndCompletedEvents($events);
});
