import { ActionIcon, Button, Paper, Text, Tooltip } from "@mantine/core"
import { useModals } from "@mantine/modals"
import { Task } from "@prisma/client"
import Flex from "components/glue/Flex"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import IconButton from "components/glue/IconButton"
import Link from "next/link"
import api from "lib/glue/api"
import { showNotification } from "@mantine/notifications"
import { mutate } from "swr"

interface ITaskItemPrivateProps {
  task?: Task
}

const TaskItemPrivate = ({ task }: ITaskItemPrivateProps) => {
  // const { mutate } = useSWRConfig()

  // const handleChange = async () => {
  //   mutate(
  //     "/api/task",
  //     (prevTasks) => {
  //       const newTasks = prevTasks?.map((prevTask) => {
  //         if (prevTask?.id === task?.id) {
  //           return {
  //             ...prevTask,
  //             isComplete: !prevTask?.isComplete,
  //           }
  //         }
  //         return prevTask
  //       })
  //       return newTasks
  //     },
  //     {
  //       revalidate: false,
  //     }
  //   )
  //   api.put(`/api/task/${task?.id}`, {
  //     isComplete: !task?.isComplete,
  //   })
  // }

  const handleDelete = async () => {
    await api.delete(`/tasks/${task?.id}`)
    mutate("/tasks/my-tasks")
    showNotification({
      title: "Task deleted",
      message: "The task was successfully deleted.",
      color: "green",
    })
  }

  const modals = useModals()
  const openConfirmModal = (event) => {
    event?.stopPropagation()

    modals.openConfirmModal({
      title: "Confirm delete",
      children: (
        <Text size="sm">
          Are you sure you want to delete this task? Your action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      // onCancel: () => console.log('Cancel'),
      onConfirm: () => handleDelete(),
    })
  }

  return (
    <Link href={`/tasks/edit/${task?.id}`}>
      <Paper my="md" withBorder>
        <Flex justify="space-between">
          <Text>{task?.name}</Text>
          <IconButton
            color="red"
            onClick={openConfirmModal}
            tooltipLabel="Delete"
          >
            <DeleteOutlinedIcon />
          </IconButton>
        </Flex>
      </Paper>
    </Link>
  )
}

export default TaskItemPrivate
