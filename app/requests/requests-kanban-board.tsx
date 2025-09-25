"use client"

import { Badge } from "@/components/ui/badge";
import { 
  KanbanProvider, 
  KanbanBoard, 
  KanbanHeader, 
  KanbanCards, 
  KanbanCard,
  type RequestItem,
  type RequestColumn 
} from "@/components/ui/kanban";
import { RequestItemType } from "@/lib/actions/request-actions";
import { RequestsPageClient } from "@/app/requests/requests-client";

interface RequestsKanbanBoardProps {
  columns: RequestColumn[];
  requests: RequestItemType[];
}

export function RequestsKanbanBoard({ columns, requests }: RequestsKanbanBoardProps) {
  const handleDataChange = async (newData: RequestItemType[]) => {
    // This will be handled by individual card actions
    console.log('Data changed:', newData);
  };

  return (
    <KanbanProvider
      columns={columns}
      data={requests}
      onDataChange={handleDataChange}
    >
      {(column) => (
        <KanbanBoard key={column.id} id={column.id}>
          <KanbanHeader>
            <div className="flex items-center justify-between">
              <span>{column.name}</span>
              <Badge variant="secondary" className="text-xs">
                {requests.filter(r => r.column === column.id).length}
              </Badge>
            </div>
          </KanbanHeader>
          <KanbanCards id={column.id}>
            {(request) => (
              <RequestsPageClient key={request.id} request={request} />
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
}
