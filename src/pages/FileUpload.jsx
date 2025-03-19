import { Box, Table, Center, Grid, GridItem, Select, Portal, createListCollection, CloseButton, Dialog } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
  const [selectedData, setSelectedData] = useState({});
  const [columnSelections, setColumnSelections] = useState({});

  // Holatlarni localStorage’dan tiklash
  useEffect(() => {
    const savedInput = localStorage.getItem("input");
    const savedOutput = localStorage.getItem("output");
    const savedDateTime = localStorage.getItem("dateTime");
    const savedFullData = localStorage.getItem("fullData");
    const savedSelectedData = localStorage.getItem("selectedData");
    const savedColumnSelections = localStorage.getItem("columnSelections");

    if (savedInput) setInput(JSON.parse(savedInput));
    if (savedOutput) setOutput(JSON.parse(savedOutput));
    if (savedDateTime) setDateTime(JSON.parse(savedDateTime));
    if (savedFullData) setFullData(JSON.parse(savedFullData));
    if (savedSelectedData) setSelectedData(JSON.parse(savedSelectedData));
    if (savedColumnSelections) setColumnSelections(JSON.parse(savedColumnSelections));

    console.log("Restored from localStorage:", {
      input: savedInput,
      output: savedOutput,
      dateTime: savedDateTime,
      fullData: savedFullData,
      selectedData: savedSelectedData,
      columnSelections: savedColumnSelections,
    });
  }, []);

  // Holatlarni localStorage’ga saqlash
  useEffect(() => {
    localStorage.setItem("input", JSON.stringify(input));
  }, [input]);

  useEffect(() => {
    localStorage.setItem("output", JSON.stringify(output));
  }, [output]);

  useEffect(() => {
    localStorage.setItem("dateTime", JSON.stringify(dateTime));
  }, [dateTime]);

  useEffect(() => {
    localStorage.setItem("fullData", JSON.stringify(fullData));
  }, [fullData]);

  useEffect(() => {
    localStorage.setItem("selectedData", JSON.stringify(selectedData));
  }, [selectedData]);

  useEffect(() => {
    localStorage.setItem("columnSelections", JSON.stringify(columnSelections));
  }, [columnSelections]);

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

  const keys = Object.keys(fileData);
  const maxRows = Math.max(...keys.map((key) => fileData[key].length));

  const tableSize = () => {
    const keysLen = keys.length;
    if (keysLen <= 3) return "sm";
    else if (keysLen <= 6) return "md";
    else return "lg";
  };

  const resetAllSelections = () => {
    setInput([]);
    setOutput([]);
    setDateTime([]);
    setFullData([]);
    setSelectedData({});
    setColumnSelections({});
    localStorage.clear(); // Agar barchasini tozalash kerak bo‘lsa
  };

  const clearColumnSelection = (key) => {
    setColumnSelections((prev) => {
      const newSelections = { ...prev };
      delete newSelections[key];
      return newSelections;
    });

    if (columnSelections[key] === "input") {
      setInput([]);
      delete selectedData["input"];
      setFullData((prevData) => prevData.map((item) => ({ ...item, input: null })));
    } else if (columnSelections[key] === "output") {
      setOutput([]);
      delete selectedData["output"];
      setFullData((prevData) => prevData.map((item) => ({ ...item, output: null })));
    } else if (columnSelections[key] === "datetime") {
      setDateTime([]);
      delete selectedData["datetime"];
      setFullData((prevData) => prevData.map((item) => ({ ...item, datetime: null })));
    }
  };

  const handleSelect = (value, key) => {
    if (!value || value.length === 0) {
      clearColumnSelection(key);
      return;
    }

    switch (value[0]) {
      case "input":
        const numericInput = fileData[key]
          .map((val) => {
            if (val === "" || val === undefined || isNaN(val)) return 0;
            return parseFloat(val);
          })
          .filter((val) => !isNaN(val));
        setInput(numericInput);
        setColumnSelections((prev) => ({ ...prev, [key]: "input" }));
        setFullData((prevData) => {
          if (prevData.length === 0) {
            return numericInput.map((value) => ({ input: value }));
          } else {
            return prevData.map((item, index) => ({
              ...item,
              input: numericInput[index] || null,
            }));
          }
        });
        delete selectedData["input"];
        setSelectedData({ ...selectedData, input: fileData[key] });
        break;
      case "output":
        setOutput(fileData[key]);
        setColumnSelections((prev) => ({ ...prev, [key]: "output" }));
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
        delete selectedData["output"];
        setSelectedData({ ...selectedData, output: fileData[key] });
        break;
      case "datetime":
        setDateTime(fileData[key]);
        setColumnSelections((prev) => ({ ...prev, [key]: "datetime" }));
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
        delete selectedData["datetime"];
        setSelectedData({ ...selectedData, datetime: fileData[key] });
        break;
      default:
        clearColumnSelection(key);
        toaster.create({
          title: "Tanlov noto‘g‘ri, ushbu ustun tozalandi",
          type: "info",
          duration: 3000,
        });
    }
  };

  const inputMax = input.length > 0 ? Math.max(...input) : 0;
  const safeInputMax = isNaN(inputMax) ? 0 : inputMax;

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
                  <YAxis yAxisId="left" domain={[0, safeInputMax]} />
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
                        <YAxis yAxisId="left" domain={[0, safeInputMax]} />
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
      <GridItem rowSpan={5} pb="2" pr={2}>
        <Box h="100%" overflow="auto" borderWidth="1px" borderRadius="xl">
          <Table.Root size={tableSize()} showColumnBorder variant="outline">
            <Table.Header>
              <Table.Row>
                {Object.keys(fileData).map((key) => (
                  <Table.ColumnHeader p="0" key={key}>
                    <Select.Root
                      onValueChange={(e) => handleSelect(e.value, key)}
                      value={columnSelections[key] ? [columnSelections[key]] : []}
                      width="100%"
                      size={tableSize()}
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
