import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  theme,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useSidebarDrawer } from "src/contexts/SidebarDrawerContext";

import { Header } from "../components/Header";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: any = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: "datetime",
    axisBorder: {
      color: theme.colors.gray[600],
    },
    axisTicks: {
      color: theme.colors.gray[600],
    },
    categories: [
      "2021,03-18T00:00:00.000Z",
      "2021,03-19T00:00:00.000Z",
      "2021,03-20T00:00:00.000Z",
      "2021,03-21T00:00:00.000Z",
      "2021,03-22T00:00:00.000Z",
      "2021,03-23T00:00:00.000Z",
      "2021,03-24T00:00:00.000Z",
    ],
  },
  fill: {
    opacity: 0.3,
    type: "gradient",
    gradient: {
      shade: "dark",
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
};

const series = [{ name: "series1", data: [31, 120, 10, 28, 61, 18, 109] }];

export default function Dashboard() {
  const { isOpen } = useSidebarDrawer();
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });
  const bg = useColorModeValue("light", "dark");
  return (
    <Flex direction="column" h="100%" minH="100vh">
      <Header />
      <Flex
        w="100%"
        pl={isOpen ? "60" : "55"}
        pr="6"
        justifyContent="flex-end"
        alignItems="center"
      >
        <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="center">
          <Box
            p="10"
            bg={bg === "light" ? "gray.100" : "gray.900"}
            borderRadius={8}
            maxW="600"
            minW="350"
            justifyContent="center"
          >
            <Text fontSize="lg" mb="4">
              Inscritos
            </Text>
            <Chart
              options={options}
              series={series}
              type="area"
              height={160}
              width={isWideVersion ? 450 : 300}
            />
          </Box>
          <Box
            p="10"
            bg={bg === "light" ? "gray.100" : "gray.900"}
            borderRadius={8}
            maxW="600"
            minW="350"
          >
            <Text fontSize="lg" mb="4">
              Taxa de abertura
            </Text>
            <Chart
              options={options}
              series={series}
              type="area"
              height={160}
              width={isWideVersion ? 450 : 300}
            />
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}
