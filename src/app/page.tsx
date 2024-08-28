'use client';

import { Card, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MoveLeft, MoveRight } from 'lucide-react';
import { useState } from 'react';

type Permission = {
	id: string;
	name: string;
};

export default function AccessLiberation() {
	const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([
		{ id: "1", name: "Read Articles" },
		{ id: "2", name: "Write Articles" },
		{ id: "3", name: "Delete Articles" },
	]);

	const [enabledPermissions, setEnabledPermissions] = useState<Permission[]>([]);

	const [selectedPermission, setSelectedPermission] = useState<string | null>(null);

	function onDragEnd(result: any) {
		const { source, destination } = result;

		if (!destination) return;

		if (source.droppableId === destination.droppableId) {
			const items = reorder(
				source.droppableId === "availablePermissions" ? availablePermissions : enabledPermissions,
				source.index,
				destination.index
			);

			source.droppableId === "availablePermissions" ? setAvailablePermissions(items) : setEnabledPermissions(items);
		} else {
			const { sourceList, destinationList } = move(
				source.droppableId === "availablePermissions" ? availablePermissions : enabledPermissions,
				destination.droppableId === "availablePermissions" ? availablePermissions : enabledPermissions,
				source.index,
				destination.index
			);

			setAvailablePermissions(sourceList);
			setEnabledPermissions(destinationList);
		}
	}

	function reorder<T>(list: T[], startIndex: number, endIndex: number) {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	}

	function move<T>(sourceList: T[], destinationList: T[], sourceIndex: number, destinationIndex: number) {
		const sourceClone = Array.from(sourceList);
		const destClone = Array.from(destinationList);
		const [removed] = sourceClone.splice(sourceIndex, 1);
		destClone.splice(destinationIndex, 0, removed);

		return {
			sourceList: sourceClone,
			destinationList: destClone,
		};
	}

	function handleSelect(permissionId: string) {
		setSelectedPermission(permissionId);
	}

	function moveToEnabled() {
		if (selectedPermission) {
			const index = availablePermissions.findIndex(p => p.id === selectedPermission);
			if (index !== -1) {
				const { sourceList, destinationList } = move(availablePermissions, enabledPermissions, index, enabledPermissions.length);
				setAvailablePermissions(sourceList);
				setEnabledPermissions(destinationList);
				setSelectedPermission(null);
			}
		}
	}

	function moveToAvailable() {
		if (selectedPermission) {
			const index = enabledPermissions.findIndex(p => p.id === selectedPermission);
			if (index !== -1) {
				const { sourceList, destinationList } = move(enabledPermissions, availablePermissions, index, availablePermissions.length);
				setEnabledPermissions(sourceList);
				setAvailablePermissions(destinationList);
				setSelectedPermission(null);
			}
		}
	}

	return (
		<>
			<CardTitle>Liberação de Acesso</CardTitle>

			<DragDropContext onDragEnd={onDragEnd}>
				<div className="flex gap-6 items-center">
					<Droppable droppableId="availablePermissions">
						{(provided) => (
							<Card ref={provided.innerRef} {...provided.droppableProps}
								className='w-80 h-96 p-4 flex flex-col items-center'>
								<CardTitle>Funções do Sistema</CardTitle>
								<Separator className='mt-2' />
								{availablePermissions.map((permission, index) => (
									<Draggable key={permission.id} draggableId={permission.id} index={index}>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												onClick={() => handleSelect(permission.id)}
												className={`text-md w-full p-2 cursor-pointer ${selectedPermission === permission.id ? 'bg-gray-700' : ''}`}
											>
												{permission.name}
												<Separator className='mt-2' />
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</Card>
						)}
					</Droppable>
					<div className="flex flex-col gap-4">
						<MoveRight className='cursor-pointer' onClick={moveToEnabled} />
						<MoveLeft className='cursor-pointer' onClick={moveToAvailable} />
					</div>

					<Droppable droppableId="enabledPermissions">
						{(provided) => (
							<Card ref={provided.innerRef} {...provided.droppableProps}
								className='w-80 h-96 p-4 flex flex-col items-center'>
								<CardTitle>Funções liberadas para o Usuário</CardTitle>
								<Separator className='mt-2' />
								{enabledPermissions.map((permission, index) => (
									<Draggable key={permission.id} draggableId={permission.id} index={index}>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												onClick={() => handleSelect(permission.id)}
												className={`text-md w-full p-2 cursor-pointer ${selectedPermission === permission.id ? 'bg-gray-700' : ''}`}
											>
												{permission.name}
												<Separator className='mt-2' />
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</Card>
						)}
					</Droppable>
				</div>
			</DragDropContext>
		</>
	);
}
