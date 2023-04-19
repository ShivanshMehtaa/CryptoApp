import { HStack, Text } from '@chakra-ui/react'
import React from 'react'

const Item = ({title,value}) => {
  return (
    <div>
      <HStack justifyContent={'space-between'} w={'full'} my={'4'}>
        <Text fontFamily={'Bebas Neue'} letterSpacing={'wider'} >{title}</Text>
        <Text>{value}</Text>
      </HStack>
    </div>
  )
}

export default Item
