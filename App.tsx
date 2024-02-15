// shims
import '@sinonjs/text-encoding'
import 'react-native-get-random-values'
import '@ethersproject/shims'
import 'cross-fetch/polyfill'
// filename: App.tsx

// ... shims

import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, Text, Button } from 'react-native'

// Import the agent from our earlier setup
import { agent } from './setup'
// import some data types:
import { DIDResolutionResult, IIdentifier } from '@veramo/core'

const App = () => {
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([])
  const [resolutionResult, setResolutionResult] = useState<DIDResolutionResult | undefined>()

  // Resolve a DID
  const resolveDID = async (did: string) => {
    const result = await agent.resolveDid({ didUrl: did })
    console.log(JSON.stringify(result, null, 2))
    setResolutionResult(result)
  }

  // Add the new identifier to state
  const createIdentifier = async () => {
    const _id = await agent.didManagerCreate({
      provider: 'did:ethr:goerli',
    })
    setIdentifiers((s) => s.concat([_id]))
  }

  // Check for existing identifers on load and set them to state
  useEffect(() => {
    const getIdentifiers = async () => {
      const _ids = await agent.didManagerFind()
      setIdentifiers(_ids)

      // Inspect the id object in your debug tool
      console.log('_ids:', _ids)
    }

    getIdentifiers()
  }, [])

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 40, paddingTop: 60 }}>
          <Text style={{ fontSize: 35, fontWeight: 'bold' }}>SSI Test Wallet</Text>
	  {/* ---------------------------------------------------------------------------------  */}
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Identifiers</Text>
	  {/* ---------------------------------------------------------------------------------  */}
	  <View style={{ marginTop: 20 }} >
		  <Button onPress={() => createIdentifier()} title={'Create Identifier'} />
	  </View>
	  {/* ---------------------------------------------------------------------------------  */}
          <View style={{ marginBottom: 50, marginTop: 20 }}>
            {identifiers && identifiers.length > 0 ? (
              identifiers.map((id: IIdentifier) => (
                <Button 
		      onPress={() => resolveDID(id.did)} 
		      title={id.did} 
		      key={id.did} 
		      />
              ))
            ) : (
              <Text>No identifiers created yet</Text>
            )}
          </View>
	  {/* ---------------------------------------------------------------------------------  */}
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Resolved DID document:</Text>
	  {/* ---------------------------------------------------------------------------------  */}
          <View style={{ marginBottom: 50, marginTop: 20 }}>
            {resolutionResult ? (
              <Text style={{ fontSize: 16}}>{JSON.stringify(resolutionResult.didDocument, null, 2)}</Text>
            ) : (
              <Text style={{ fontSize: 16}}>tap on a DID to resolve it</Text>
            )}
          </View>
	  {/* ---------------------------------------------------------------------------------  */}
	  <Text style={{ fontSize: 12, fontWeight: 'light', marginTop: '1em' }}>Version 1.1.4</Text>
	  {/* ---------------------------------------------------------------------------------  */}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default App
