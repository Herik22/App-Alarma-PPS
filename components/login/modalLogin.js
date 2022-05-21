import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,Modal} from 'react-native'
import { Entypo,FontAwesome } from '@expo/vector-icons';
import ColorsPPS from '../../utils/ColorsPPS';

const ModalLogin = (props) => {
    useEffect(() => {
        
    },[]);
    const {showModal,setShowModal,message} = props;
    
    return (
            <Modal
                 animationType={'slide'}
                 transparent={true}
                 visible={showModal}
                 onRequestClose={()=>{console.log('modal has been close')}}>
                    <View style={{flex:1,width:'100%',height:'100%',justifyContent:'center'}}>
                    <View style={{width:'60%',height:'40%',alignSelf:'center',backgroundColor:'white',borderRadius:20,borderColor:ColorsPPS.morado,borderWidth:1}}>
                        <View style={{flex:0.25,width:'100%',alignContent:"flex-start"}} > 
                            <FontAwesome name='times' size={50} color='black' onPress={()=>{setShowModal(false)}} style={{alignSelf:'flex-end',padding:30 }} />
                        </View>
                        <View style={{flex:0.7,width:'100%',justifyContent:'center',alignContent:'center'}} > 
                            <FontAwesome name='exclamation' size={100} color={ColorsPPS.morado} style={{alignSelf:'center'}}/>
                        </View>
                        <View style={{flex:0.2,width:'100%',justifyContent:'center',flexDirection:'row'}}> 
                            <Text style={{textAlign:'center',color:ColorsPPS.morado}}> {message} </Text>
                        </View>
                    </View>
                    </View>                             
            </Modal>

    )
}
const Colors = {
    colorLetraGris:'#86939E',
    colorfondoCB:'transparent',
    violet:"#5D287E",
    azulPt:'#2E3880'
}

export default ModalLogin