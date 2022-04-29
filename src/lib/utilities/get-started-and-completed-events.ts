import { isWorkflowExecutionCompletedEvent } from './is-event-type';

type WorkflowInputAndResults = {
  input: string;
  result: string;
};

type CompletionEvent =
  | WorkflowExecutionFailedEvent
  | WorkflowExecutionCompletedEvent
  | WorkflowExecutionContinuedAsNewEvent
  | WorkflowExecutionTimedOutEvent
  | WorkflowExecutionCanceledEvent
  | WorkflowExecutionTerminatedEvent;

const completedEventTypes = [
  'WorkflowExecutionFailed',
  'WorkflowExecutionCompleted',
  'WorkflowExecutionContinuedAsNew',
  'WorkflowExecutionTimedOut',
  'WorkflowExecutionCanceled',
  'WorkflowExecutionTerminated',
] as const;

const isCompletionEvent = (event: WorkflowEvent): event is CompletionEvent => {
  for (const completionType of completedEventTypes) {
    if (event.eventType === completionType) return true;
  }
  return false;
};

const getWorkflowCompletedEvent = (events: WorkflowEvents): CompletionEvent => {
  for (const event of events) {
    if (isCompletionEvent(event)) return event;
  }
};

const getEventResult = (event: CompletionEvent) => {
  if (isWorkflowExecutionCompletedEvent(event)) {
    if (event.attributes.result === null) return null;
    return event.attributes.result.payloads;
  }

  return event.attributes;
};

export const getWorkflowStartedAndCompletedEvents = async (
  events: Eventual<WorkflowEvents>,
): Promise<WorkflowInputAndResults> => {
  events = await events;

  let input: string;
  let results: string;

  const workflowStartedEvent: WorkflowEvent = events?.find(
    (event: WorkflowEvent) => {
      return !!event.workflowExecutionStartedEventAttributes;
    },
  );

  const workflowCompletedEvent = getWorkflowCompletedEvent(events);

  if (workflowStartedEvent) {
    input = JSON.stringify(
      workflowStartedEvent?.workflowExecutionStartedEventAttributes?.input
        ?.payloads,
    );
  }

  if (workflowCompletedEvent) {
    results = JSON.stringify(getEventResult(workflowCompletedEvent));
  }

  return {
    input,
    result: results,
  };
};
