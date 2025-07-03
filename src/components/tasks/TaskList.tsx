import { useTasks, useToggleTask, useDeleteTask } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Circle, Trash2, Clock, AlertCircle } from 'lucide-react';
import { Task } from '@/types/api';

const PriorityIcon = ({ priority }: { priority: Task['priority'] }) => {
  switch (priority) {
    case 'high':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'medium':
      return <Clock className="h-4 w-4 text-warning" />;
    case 'low':
      return <Circle className="h-4 w-4 text-muted-foreground" />;
    default:
      return null;
  }
};

const TaskItem = ({ task }: { task: Task }) => {
  const toggleMutation = useToggleTask();
  const deleteMutation = useDeleteTask();

  const handleToggle = () => {
    toggleMutation.mutate(task.id);
  };

  const handleDelete = () => {
    deleteMutation.mutate(task.id);
  };

  return (
    <Card className="bg-gradient-card border-accent/20 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggle}
            disabled={toggleMutation.isPending}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              <PriorityIcon priority={task.priority} />
              <Badge 
                variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}
                className="text-xs"
              >
                {task.priority}
              </Badge>
            </div>
            
            {task.description && (
              <p className={`text-sm text-muted-foreground mb-2 ${task.completed ? 'line-through' : ''}`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {task.completed ? (
                  <span className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-success" />
                    Completed
                  </span>
                ) : (
                  `Created ${new Date(task.createdAt).toLocaleDateString()}`
                )}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskSkeleton = () => (
  <Card className="bg-gradient-card border-accent/20">
    <CardContent className="p-4">
      <div className="flex items-start space-x-3">
        <Skeleton className="h-4 w-4 mt-1" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const TaskList = () => {
  const { data, isLoading, error } = useTasks(1, 20);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-card border-destructive/20">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive">Failed to load tasks</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please check your connection and try again
          </p>
        </CardContent>
      </Card>
    );
  }

  const tasks = data?.data || [];

  if (tasks.length === 0) {
    return (
      <Card className="bg-gradient-card border-accent/20">
        <CardContent className="p-6 text-center">
          <CheckCircle2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No tasks found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first task to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};