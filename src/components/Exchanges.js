import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../index";
import { Container, HStack ,Button} from "@chakra-ui/react";
import Loader from "./Loader";
import ExchangeCard from "./ExchangeCard";
import Error from "./Error";

const Exchanges = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false)

  const changePage = (page) => {
    setPage(page);
    setLoading(true);
  };
  const btns = new Array(6).fill(1);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const { data } = await axios.get(`${server}/exchanges?page=${page}&per_page=100`);
        setExchanges(data);
        setLoading(false);
        // console.log(data);
      } catch (error) {
        setError(true)
        setLoading(false)
      }
    };
    fetchExchanges();
  }, [page]);

  if (error) return <Error message={'Error while fetching Exchanges'}/>

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <HStack wrap={"wrap"} justifyContent={'space-evenly'}>
            {exchanges.map((i) => (
              <ExchangeCard
                key={i.id}
                name={i.name}
                image={i.image}
                rank={i.trust_score_rank}
                url={i.url}
              />
            ))}
          </HStack>
          <HStack w={"full"} overflowX={"auto"} padding={"8"} justifyContent={'space-evenly'}>
            {btns.map((item, index) => (
              <Button
                key={index}
                bgColor={"blackAlpha.900"}
                color={"white"}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </HStack>
        </>
      )}
    </Container>
  );
};

export default Exchanges;
