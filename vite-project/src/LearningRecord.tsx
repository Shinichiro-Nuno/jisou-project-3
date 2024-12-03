import { useCallback, useState } from 'react'

function LearningRecord () {
  type Record = {
    title: string
    time: number
  };

  const [title, setTitle] = useState('');
  const [time, setTime] = useState(0);
  const [records, setRecords] = useState<Record[]>([]);
  const [isInput, setIsInput] = useState(true);

  const onClickSave = useCallback((title: string, time: number) => {
    if (title && time) {
      const newRecords = [...records, { title, time }];
      setRecords(newRecords);
      setTitle('');
      setTime(0);
      setIsInput(true);
    } else {
      setIsInput(false);
    }
  }, [records]);

  const totalTime = records.reduce((sum, record) => sum + record.time, 0);

  return (
    <>
      <h1>学習記録一覧</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
        <p>学習内容</p>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}>
        </input>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
        <p>学習時間</p>
        <input
          type='number'
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}>
        </input>
      </div>
      <p>{`入力されている学習内容：${title}`}</p>
      <p>{`入力されている時間：${time}`}</p>
      <button onClick={() => onClickSave(title, time)}>登録</button>
      {!isInput && <p>入力されていない項目があります</p>}
      <ul>
        {
          records.map((record, index) => {
            return (
              <li key={index}>{`${record.title} ${record.time}時間`}</li>
            )
          })
        }
      </ul>
      <p>{`合計時間：${totalTime} / 1000 (h)`}</p>
    </>
  )
}

export default LearningRecord
