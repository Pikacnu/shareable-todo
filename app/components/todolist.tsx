import { useState } from 'react';
import { useFetcher } from 'react-router-dom';

interface TodoListInfo {
  id: number;
  defaulttitle: string;
  className?: string;
  isOwner?: boolean;
}

export default function TodoListEdit({
  id,
  defaulttitle,
  className,
  isOwner,
}: TodoListInfo) {
  const Fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(defaulttitle);
  const [description, setDescription] = useState('');
  return (
    <div className={'flex justify-between ' + className}>
      <div className={`flex max-lg:*:max-w-[20vw] ${!isEditing ? '*:bg-transparent' : ''}`}>
        <input
          type="text"
          disabled={!isEditing}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        ></input>
        <input
          type="text"
          placeholder={isEditing ? 'Description' : ''}
          disabled={!isEditing}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></input>
      </div>
      {isOwner === undefined || !isOwner ? null : (
        <button
          className="lg:p-2"
          onClick={() => {
            if (isEditing) {
              if (defaulttitle === title) return setIsEditing(false);
              const formData = new FormData();
              formData.append('id', id.toString());
              formData.append('title', title);
              formData.append('description', description);
              formData.append('type', 'updateInfo');
              Fetcher.submit(formData, {
                action: '/api/todolist',
                method: 'PUT',
              });
            }
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      )}
    </div>
  );
}
