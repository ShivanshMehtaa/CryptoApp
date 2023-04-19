import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  Image,
  Radio,
  RadioGroup,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import axios from "axios";
import { server } from "../index";
import { useParams } from "react-router-dom";
import Error from "./Error";
import CustomBar from "./CustomBar";
import Chart from "./Chart";

const CoinDetails = () => {
  const [coin, setCoin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  const [days, setDays] = useState("24h");
  const [chartArray, setChartArray] = useState([]);

  const switchChartStats = (key) => {
    switch (key) {
      case "24h":
        setDays("24h");
        setLoading(true);
        break;
      case "7d":
        setDays("7d");
        setLoading(true);
        break;
      case "14d":
        setDays("14d");
        setLoading(true);
        break;
      case "30d":
        setDays("30d");
        setLoading(true);
        break;
      case "60d":
        setDays("60d");
        setLoading(true);
        break;
      case "365d":
        setDays("365d");
        setLoading(true);
        break;
      case "max":
        setDays("max");
        setLoading(true);
        break;

      default:
        setDays("7d");
        setLoading(true);
        break;
    }
  };

  const params = useParams();
  const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  const btns = ["24h", "7d", "14d", "30d", "60d","200d", "365d", "max"];

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/${params.id}`);

        const { data: chartData } = await axios.get(`${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`);

        setCoin(data);
        setLoading(false);
        setChartArray(chartData.prices);
        // console.log(chartData);
        // console.log(data);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCoin();
  }, [currency, days, params.id]);

  if (error) return <Error message={"Error while fetching Coin Details"} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box w={"full"} borderWidth={1}>
            <Chart arr={chartArray} currency={currencySymbol} days={days} />
          </Box>

          <HStack p={"4"} overflowX={'auto'}>
            {btns.map((i) => (
              <Button key={i} onClick={() => switchChartStats()}>
                {i}
              </Button>
            ))}
          </HStack>

          <RadioGroup defaultValue={currency} onChange={setCurrency} p={"4"}>
            <HStack m={"2"} spacing={4}>
              <Radio value={"inr"}>₹ INR</Radio>
              <Radio value={"eur"}>€ EUR</Radio>
              <Radio value={"usd"}>$ USD</Radio>
            </HStack>
          </RadioGroup>

          <VStack spacing={"4"} padding={"8"} alignItems={"flex-start"}>
            <Image
              src={coin.image.large}
              w={"16"}
              h={"16"}
              objectFit={"contain"}
            />

            <Stat>
              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>
                {" "}
                {currencySymbol} {coin.market_data.current_price[currency]}
              </StatNumber>
              <StatHelpText>
                {" "}
                <StatArrow
                  type={
                    coin.market_data.price_change_percentage_24h > 0
                      ? "increase"
                      : "decrease"
                  }
                />
                {coin.market_data.price_change_percentage_24h}%
              </StatHelpText>
            </Stat>

            <Badge fontSize={"2xl"} bgColor={"blackAlpha.700"} color="white">
              {`# ${coin.market_cap_rank}`}
            </Badge>

            <CustomBar
              high={`${currencySymbol}${coin.market_data.high_24h[currency]}`}
              low={`${currencySymbol}${coin.market_data.low_24h[currency]}`}
            />

            <Text fontSize={"small"} alignSelf={"center"} opacity={0.7}>
              Last Upadted on{" "}
              {Date(coin.market_data.last_updated).split("G")[0]}
            </Text>
          </VStack>
        </>
      )}
    </Container>
  );
};

export default CoinDetails;
