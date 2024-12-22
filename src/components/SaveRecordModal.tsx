import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box, Input, Stack, Text } from "@chakra-ui/react";
import { Button } from "../components/ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

import { Record } from "../domain/record";

type SaveRecordDialogProps = {
  editingRecord?: Record;
  onSave?: (title: string, time: number) => void;
  onUpdate?: (id: string, title: string, time: number) => void;
};

type FormData = {
  title: string;
  time: number;
};

export const SaveRecordDialog = ({
  editingRecord,
  onSave,
  onUpdate,
}: SaveRecordDialogProps) => {
  console.log("editingRecord:", editingRecord);
  const closeRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: editingRecord
      ? {
          title: editingRecord.title,
          time: editingRecord.time,
        }
      : undefined,
  });

  useEffect(() => {
    if (editingRecord) {
      reset({
        title: editingRecord.title,
        time: editingRecord.time,
      });
    } else {
      reset({
        title: "",
        time: undefined,
      });
    }
  }, [editingRecord, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (editingRecord && onUpdate) {
        await onUpdate(editingRecord.id, data.title, data.time);
      } else if (onSave) {
        await onSave(data.title, data.time);
      }
      reset();
      closeRef.current?.click();
    } catch (error) {
      console.error(
        editingRecord ? "データ登録エラー" : "データ登録エラー",
        error
      );
    }
  };

  return (
    <DialogRoot>
      <DialogTrigger>
        <Button colorPalette="cyan" width="sl" height={8}>
          {editingRecord ? "編集" : "新規登録"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingRecord ? "記録編集" : "新規登録"}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <Box>
                <label htmlFor="learning-content">学習内容</label>
                <Input
                  id="learning-content"
                  type="text"
                  {...register("title", { required: "内容の入力は必須です" })}
                />
                {errors.title && (
                  <Text color="red.500">{errors.title.message}</Text>
                )}
              </Box>
              <Box>
                <label htmlFor="learning-time">学習時間</label>
                <Input
                  id="learning-time"
                  type="number"
                  min="1"
                  {...register("time", {
                    required: "時間の入力は必須です",
                    min: {
                      value: 1,
                      message: "時間は0以上である必要があります",
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.time && (
                  <Text color="red.500">{errors.time.message}</Text>
                )}
              </Box>
            </Stack>
          </form>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" ref={closeRef}>
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button
            type="submit"
            colorPalette="cyan"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {editingRecord ? "更新" : "登録"}
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
