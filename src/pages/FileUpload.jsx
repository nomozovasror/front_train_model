import { Box, Table, Center, Grid, GridItem, Select, Portal, createListCollection, Button, CloseButton, Dialog } from "@chakra-ui/react";
import { useState } from "react";
import { useOutletContext } from "react-router";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toaster } from "../components/ui/toaster";

export default function FileUploadPage() {
  const { fileData } = useOutletContext();
  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);
  const [dateTime, setDateTime] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!fileData) {
    return (
      <Center h="100vh">
        <div>Fayl yuklanmagan</div>
      </Center>
    );
  }

  const selectItems = createListCollection({
    items: [
      { label: "DateTime", value: "datetime" },
      { label: "Output", value: "output" },
      { label: "Input", value: "input" },
    ],
  });

  const roundTo = (value) => {
    if (value < 100) {
      return value;
    }

    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    return Math.ceil(value / magnitude) * magnitude;
  };

  const keys = Object.keys(fileData);
  const maxRows = Math.max(...keys.map((key) => fileData[key].length));

  const tableSize = () => {
    const keysLen = keys.length;
    if (keysLen <= 3) {
      return "sm";
    } else if (keysLen > 3 && keysLen <= 6) {
      return "md";
    } else {
      return "lg";
    }
  };
  const handleSelect = (value, key) => {
    switch (value[0]) {
      case "input":
        console.log("input");
        setInput(fileData[key]);
        setFullData((prevData) => {
          if (prevData.length === 0) {
            return fileData[key].map((value) => ({ input: value }));
          } else {
            return prevData.map((item, index) => ({
              ...item,
              input: fileData[key][index] || null, // Agar index yo‘q bo‘lsa, `null` qo‘shiladi
            }));
          }
        });
        break;
      case "output":
        setOutput(fileData[key]);
        setFullData((prevData) => {
          if (prevData.length === 0) {
            return fileData[key].map((value) => ({ output: value }));
          } else {
            return prevData.map((item, index) => ({
              ...item,
              output: fileData[key][index] || null,
            }));
          }
        });
        break;
      case "datetime":
        setDateTime(fileData[key]);
        setFullData((prevData) => {
          if (prevData.length === 0) {
            return fileData[key].map((value) => ({ datetime: value }));
          } else {
            return prevData.map((item, index) => ({
              ...item,
              datetime: fileData[key][index] || null,
            }));
          }
        });
        break;
      default:
        toaster.create({
          title: "Nimadir xato ketti",
          type: "error",
          duration: 3000,
        });
    }
  };

  const inputMax = Math.max(...input);

  return (
    <Grid h="100vh" templateRows="repeat(9, 1fr)" gap={2}>
      <GridItem rowSpan={4} pt={2} pr={2}>
        <Dialog.Root onOpenChange={(open) => setIsDialogOpen(open)} size="cover" placement="center">
          <Dialog.Trigger asChild>
            <Box w="100%" h="100%" borderWidth="1px" borderRadius="xl">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fullData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="datetime" />
                  <YAxis yAxisId="left" domain={[0, inputMax]} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="input" stroke="#8884d8" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Dialog.Trigger>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content width="90vw" height="80vh">
              <Dialog.CloseTrigger />
              <Dialog.Header>
                <Dialog.Title>Grafik tafsilotlari</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <Box width="100%" height="100%">
                  {isDialogOpen && (
                    <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
                      <LineChart data={fullData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="datetime" />
                        <YAxis yAxisId="left" domain={[0, inputMax]} />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="input" stroke="#8884d8" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </Dialog.Body>
              <Dialog.Footer />
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </GridItem>
      <GridItem rowSpan={5} pb="2" pr="2">
        <Box h="100%" overflow="auto" borderWidth="1px" borderRadius="xl">
          <Table.Root size={tableSize()} showColumnBorder variant="outline">
            <Table.Header>
              <Table.Row>
                {Object.keys(fileData).map((key) => (
                  <Table.ColumnHeader p="0" key={key}>
                    <Select.Root
                      onValueChange={(e) => handleSelect(e.value, key)}
                      width="100%"
                      size="sm" // Table bilan moslash uchun kichikroq size
                      variant="subtle"
                      collection={selectItems}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder={key} />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.ClearTrigger />
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content>
                            {selectItems.items.map((item) => (
                              <Select.Item item={item} key={item.value}>
                                {item.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Array.from({ length: maxRows }).map((_, rowIndex) => (
                <Table.Row key={rowIndex}>
                  {keys.map((key) => (
                    <Table.Cell px="2" key={key}>
                      {fileData[key][rowIndex] || "-"}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </GridItem>
    </Grid>
  );
}
