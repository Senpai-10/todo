import { CategoriesData, T_Task, TasksDisplay } from '../types';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api';

import { Task } from './Task';
import PlusIcon from '../assets/plus.svg';
import TrashIcon from '../assets/trash.svg';
import SettingsIcon from '../assets/settings.svg';
import { SettingsPopup } from './SettingsPopup';

import '../css/components/MainContent.css';

interface Props {
    tasksList: T_Task[];
    categoriesData: CategoriesData;
    currentCategory: string | null;
    setCurrentCategory: React.Dispatch<React.SetStateAction<string | null>>;
    tasksSearchQuery: string;
    setTasksSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    showTasks: TasksDisplay;
    setShowTasks: React.Dispatch<React.SetStateAction<TasksDisplay>>;
    addTaskInputRef: React.RefObject<HTMLInputElement>;
    searchInputRef: React.RefObject<HTMLInputElement>;
    getCategories: () => void;
    getTasks: () => void;
}

export function MainContent(props: Props) {
    const {
        tasksList,
        categoriesData,
        currentCategory,
        setCurrentCategory,
        tasksSearchQuery,
        setTasksSearchQuery,
        showTasks,
        setShowTasks,
        addTaskInputRef,
        searchInputRef,
        getCategories,
        getTasks,
    } = props;
    const [newTask, setNewTask] = useState('');
    const [settingsTriggerPopup, setSettingsTriggerPopup] = useState(false)

    const handleAddTask = () => {
        if (newTask == '' || currentCategory == null) return;

        invoke('add_task', { title: newTask, category: currentCategory }).then(
            () => {
                getCategories();
                getTasks();
            },
        );

        setNewTask('');
    };

    const handleRemoveCategory = () => {
        if (currentCategory == null) return;

        const currentCategoryIndex = categoriesData.categories.findIndex((cat) => cat.name == currentCategory)

        invoke('remove_category', { name: currentCategory }).then(() => {
            if (currentCategoryIndex == 0) {
                // Focus on `All Tasks` Category
                setCurrentCategory(null);
            } else {
                // Focus on the category before current category
                setCurrentCategory(categoriesData.categories[currentCategoryIndex - 1].name)
            }

            getCategories();
        });
    };

    const handleOpenSettings = () => {
        setSettingsTriggerPopup(true)
    }

    return (
        <div className='main-content'>
            <div className='header'>
                <span className='header-category-name'>
                    {currentCategory != null ? currentCategory : 'All Tasks'}
                </span>
                <div className='header-options'>
                    <input
                        ref={searchInputRef}
                        placeholder='Search'
                        value={tasksSearchQuery}
                        onChange={(e) =>
                            setTasksSearchQuery(e.currentTarget.value)
                        }
                    />
                    <select
                        value={showTasks}
                        title='Show tasks by status'
                        onChange={(e) =>
                            setShowTasks(e.currentTarget.value as TasksDisplay)
                        }
                    >
                        <option value='all'>all</option>
                        <option value='active'>active</option>
                        <option value='done'>done</option>
                    </select>
                    <img
                        className="settings-icon"
                        title="App settings"
                        onClick={handleOpenSettings}
                        src={SettingsIcon}
                    />
                    <img
                        className='remove-icon'
                        onClick={handleRemoveCategory}
                        src={TrashIcon}
                    />
                </div>
            </div>
            <div className='separator'></div>
            <div className='tasks-list'>
                {tasksList.map((task) => {
                    return (
                        <Task
                            key={task.id}
                            task={task}
                            getCategories={getCategories}
                            getTasks={getTasks}
                        />
                    );
                })}
            </div>
            <div className='new-task-container'>
                <input
                    className='new-task-input'
                    ref={addTaskInputRef}
                    value={newTask}
                    onChange={(e) => setNewTask(e.currentTarget.value)}
                    onKeyDown={(e) =>
                        e.key == 'Enter' ? handleAddTask() : null
                    }
                    placeholder='Add a task'
                />
                <button onClick={handleAddTask}>
                    <img src={PlusIcon} />
                </button>
            </div>
            {
                settingsTriggerPopup ? <SettingsPopup trigger={setSettingsTriggerPopup} />
                    : null
            }
        </div>
    );
}
