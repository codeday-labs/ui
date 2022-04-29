type Id = WorkflowEvent['id'];

type EventGroup = {
  id: Id;
  name: string;
  events: Map<Id, WorkflowEvent>;
  eventIds: Set<Id>;
  initialEvent: WorkflowEvent;
  timestamp: WorkflowEvent['timestamp'];
  eventTime: WorkflowEvent['eventTime'];
  attributes: WorkflowEvent['attributes'];
} & Pick<WorkflowEvent, 'timestamp' | 'classification' | 'category'>;

type EventGroups = EventGroup[];
