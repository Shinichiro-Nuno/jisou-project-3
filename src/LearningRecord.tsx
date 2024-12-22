import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  DeleteRecord,
  FetchRecords,
  InsertRecord,
  UpdateRecord,
} from "./lib/supabase";
import { SaveRecordDialog } from "./components/SaveRecordModal";

function LearningRecord() {
  type Record = {
    id: string;
    title: string;
    time: number;
  };

  const [records, setRecords] = useState<Record[]>([]);
  const [isInput, setIsInput] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const onClickSave = useCallback(
    async (title: string, time: number) => {
      if (title && time) {
        const newRecord = await InsertRecord(title, time);

        if (newRecord) {
          setIsInput(true);
          setRecords((prev) => [...prev, newRecord]);
          console.log("登録完了");
        } else {
          console.error("データ登録に失敗しました");
        }
      } else {
        setIsInput(false);
      }
    },
    [setRecords]
  );

  const onClickUpdate = useCallback(
    async (recordId: string, title: string, time: number) => {
      if (recordId && title && time) {
        const updatedRecord = await UpdateRecord(recordId, title, time);

        if (updatedRecord) {
          setRecords((prev) =>
            prev.map((record) =>
              record.id === recordId ? updatedRecord : record
            )
          );
          console.log("更新完了");
        } else {
          console.error("データ更新に失敗しました");
        }
      }
    },
    [setRecords]
  );

  const onClickDelete = useCallback(
    async (recordId: string, index: number) => {
      if (recordId) {
        const success = await DeleteRecord(recordId);

        if (success) {
          const newRecords = [...records];
          newRecords.splice(index, 1);
          setRecords(newRecords);
        } else {
          console.log("データ削除に失敗しました");
        }
      }
    },
    [records]
  );

  useEffect(() => {
    const fetchAndSetRecords = async () => {
      const records = await FetchRecords();
      setRecords(records);
      setIsLoading(false);
    };

    fetchAndSetRecords();
  }, []);

  const totalTime = records.reduce((sum, record) => sum + record.time, 0);

  return (
    <>
      <Box
        p={4}
        minW={{ base: "90%", md: "600px" }}
        fontSize={{ base: "sm", md: "md" }}
        borderWidth="2px"
        borderColor="cyan"
        borderRadius="md"
      >
        <Stack>
          <Heading fontSize="3xl">学習記録一覧</Heading>
          <Box>
            <SaveRecordDialog
              // 登録ボタン
              onSave={(title, time) => {
                onClickSave(title, time);
              }}
            />
          </Box>
          {!isInput && <p>入力されていない項目があります</p>}
          <Box as="ul" listStylePosition="inside">
            {isLoading ? (
              <VStack colorPalette="teal">
                <Spinner role="progressbar" color="colorPalette.600" />
              </VStack>
            ) : (
              records.map((record, index) => (
                <Box
                  display="flex"
                  key={index}
                  as="li"
                  borderColor="cyan"
                  borderWidth="2px"
                  borderRadius="md"
                  marginBottom="1"
                  alignItems="center"
                  justifyContent="space-between"
                  p={3}
                >
                  <Text marginRight={4}>{record.title}</Text>
                  <Text>{`${record.time}時間`}</Text>
                  <Box>
                    <Button
                      height={8}
                      size={{ base: "sm", md: "md" }}
                      onClick={() => onClickDelete(record.id, index)}
                      colorPalette="cyan"
                      style={{ marginLeft: "8px", marginRight: "8px" }}
                    >
                      削除
                    </Button>
                    <SaveRecordDialog
                      // 編集ボタン
                      editingRecord={record}
                      onUpdate={(recordId, title, time) => {
                        onClickUpdate(recordId, title, time);
                      }}
                    ></SaveRecordDialog>
                  </Box>
                </Box>
              ))
            )}
          </Box>
          <p>{`合計時間：${totalTime} / 1000 (h)`}</p>
        </Stack>
      </Box>
    </>
  );
}

export default LearningRecord;
