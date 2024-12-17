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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      await onSave(data.title, data.time);
      reset();
    } catch (error) {
      console.error("データ登録エラー:", error);
    }
  };

  return (
    <DialogRoot>
      <DialogTrigger>
        <Button colorPalette="cyan" width="sl" height={8}>
          登録
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>登録フォーム</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <Box>
                <label>学習内容</label>
                <Input
                  type="text"
                  {...register("title", { required: "内容の入力は必須です" })}
                />
                {errors.title && (
                  <Text color="red.500">{errors.title.message}</Text>
                )}
              </Box>
              <Box>
                <label>学習時間</label>
                <Input
                  type="number"
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
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild disabled={!isValid}>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              登録
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
