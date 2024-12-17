import { useCallback, useEffect, useState } from "react";
import { supabase } from "./lib/supabase-client";
import {
  Box,
  Button,
  Heading,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { fetchRecords, insertRecord } from "./lib/supabase";
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
        const newRecord = await insertRecord(title, time);

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

  const onClickDelete = useCallback(
    async (recordId: string, index: number) => {
      if (recordId) {
        const { error } = await supabase
          .from("study-record")
          .delete()
          .eq("id", recordId);

        if (error) {
          console.error("データ削除エラー:", error.message);
          return;
        }

        const newRecords = [...records];
        newRecords.splice(index, 1);
        setRecords(newRecords);
      }
    },
    [records]
  );

  useEffect(() => {
    const fetchAndSetRecords = async () => {
      const records = await fetchRecords();
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
              onSave={(title, time) => {
                onClickSave(title, time);
              }}
            />
          </Box>
          {!isInput && <p>入力されていない項目があります</p>}
          <Box as="ul" listStylePosition="inside">
            {isLoading ? (
              <VStack colorPalette="teal">
                <Spinner color="colorPalette.600" />
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
                  <Text>{record.title}</Text>
                  <Text>{`${record.time}時間`}</Text>
                  <Button
                    height={8}
                    onClick={() => onClickDelete(record.id, index)}
                    colorPalette="cyan"
                    style={{ marginLeft: "8px" }}
                  >
                    削除
                  </Button>
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
