import { Box, Table, Center, Grid, GridItem, Select, Portal, createListCollection } from "@chakra-ui/react";
import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";

export default function FileUploadPage() {
  const { fileData } = useOutletContext();

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
    if (keysLen <= 3) {
      return "sm";
    } else if (keysLen > 3 && keysLen <= 6) {
      return "md";
    } else {
      return "lg";
    }
  };

  const handleSelect = (value, key) => {
    console.log(`Selected: ${value} for column: ${key}`);
  };

  return (
    <Grid h="100vh" templateRows="repeat(6, 1fr)" gap={2}>
      <GridItem rowSpan={2}></GridItem>
      <GridItem rowSpan={4} pb="2" pr="2">
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
