import { useRef } from "react";
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

type SaveRecordDialogProps = {
  onSave: (title: string, time: number) => void;
};

type FormData = {
  title: string;
  time: number;
};

export const SaveRecordDialog = ({ onSave }: SaveRecordDialogProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    try {
      await onSave(data.title, data.time);
      reset();
      closeRef.current?.click();
    } catch (error) {
      console.error("データ登録エラー:", error);
    }
  };

  return (
    <DialogRoot>
      <DialogTrigger>
        <Button colorPalette="cyan" width="sl" height={8}>
          新規登録
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規登録</DialogTitle>
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
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            登録
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
