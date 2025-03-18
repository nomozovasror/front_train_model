import { Outlet } from "react-router";
import { useState } from "react";
import { LuSunDim, LuMoon, LuArrowLeft, LuArrowRight, LuUpload } from "react-icons/lu";
import { Link, useLocation } from "react-router";
import { Grid, GridItem, Container, Box, Button, Icon, Flex, Heading, IconButton, FileUpload } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "../components/ui/color-mode";
import { toaster } from "../components/ui/toaster";
import * as XLSX from "xlsx";

function RootLayout() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.900");
  const buttonColor = useColorModeValue("blue", "red");
  const location = useLocation();
  const pathname = location.pathname;
  const isLight = colorMode === "light";
  const [fileData, setFileData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (files) => {
    if (!files || files.length === 0 || isProcessing) {
      console.error("No file selected or processing in progress");
      return;
    }

    setIsProcessing(true); // Jarayon boshlandi
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        const transformedData = {};
        console.log(json);
        if (json.length > 0) {
          Object.keys(json[0]).forEach((key) => {
            if (key !== "__rowNum__") {
              transformedData[key] = json.map((row) => String(row[key]));
            }
          });
        }

        setFileData(transformedData);
        toaster.create({
          title: "Ma'lumotlar muvaffaqiyatli yuklandi!",
          type: "success",
          duration: 3000,
        });
      } catch (error) {
        toaster.create({
          title: `Faylni tahlil qilishda xatolik yuz berdi: ${error}`,
          type: "error",
          duration: 3000,
        });
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = (error) => {
      toaster.create({
        title: `Faylni o'qishda xatolik: ${error}`,
        type: "error",
        duration: 3000,
      });
      setIsProcessing(false);
    };
    reader.readAsArrayBuffer(file);
  };

  console.log(fileData);

  return (
    <Container fluid p="0" bg={bgColor}>
      <Grid templateColumns="repeat(24, 1fr)" gap="1">
        <GridItem colSpan={6}>
          <Box height="100vh" p="2">
            <Box bg={bgColor} height="100%" borderWidth="1px" borderRadius="2xl" p={2}>
              <Flex height="100%" direction="column" justifyContent="space-between">
                <Box mt="2" mx="1">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="2xl">AI Model Training</Heading>
                    <IconButton borderRadius="full" variant="outline" onClick={toggleColorMode} aria-label="color mode">
                      {isLight ? <LuMoon /> : <LuSunDim />}
                    </IconButton>
                  </Flex>
                </Box>
                <Box>
                  {pathname === "/" && (
                    <Box maxW="xl">
                      <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1}>
                        <FileUpload.HiddenInput accept=".xlsx" onChange={(e) => handleFileUpload(e.target.files)} />
                        <FileUpload.Dropzone>
                          <FileUpload.DropzoneContent>
                            <Icon as={LuUpload} w="28px" h="28px" color="fg.muted" />
                            <Box>Drag and drop files here</Box>
                            <Box color="fg.muted">.xlsx files only</Box>
                          </FileUpload.DropzoneContent>
                        </FileUpload.Dropzone>
                        <FileUpload.List />
                      </FileUpload.Root>
                    </Box>
                  )}
                </Box>
                <Box>
                  {pathname === "/" && (
                    <Button disabled={!fileData} asChild w="100%" borderRadius="2xl">
                      <Link to="filter/">
                        Keyingi <LuArrowRight />
                      </Link>
                    </Button>
                  )}
                  {pathname === "/filter/" && (
                    <Grid templateColumns="repeat(6, 1fr)" gap={0.3}>
                      <GridItem colSpan={2}>
                        <Link to="/">
                          <Button w="100%" borderStartRadius="2xl">
                            <LuArrowLeft /> Orqaga
                          </Button>
                        </Link>
                      </GridItem>
                      <GridItem colSpan={4}>
                        <Link to="#">
                          <Button w="100%" borderEndRadius="2xl">
                            Keyingi <LuArrowRight />
                          </Button>
                        </Link>
                      </GridItem>
                    </Grid>
                  )}
                </Box>
              </Flex>
            </Box>
          </Box>
        </GridItem>
        <GridItem colSpan={18}>
          <Outlet context={{ fileData }} />
        </GridItem>
      </Grid>
    </Container>
  );
}

export default RootLayout;
