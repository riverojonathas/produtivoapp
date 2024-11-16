export interface IProduct {
  id: string;
  name: string;
  description: string;
  objectives: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  productId: string;
  sprintId?: string;
  createdAt: Date;
  updatedAt: Date;
  assigneeId?: string;
}

export interface ISprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed';
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFeedback {
  id: string;
  content: string;
  type: 'bug' | 'feature' | 'improvement';
  status: 'new' | 'in_review' | 'accepted' | 'rejected';
  createdAt: Date;
  userId: string;
} 