import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Button, ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import useDaysOfMonth from '../hooks/useDaysOfMonth';
import { getMonthInChinese } from '../lib/lib';


// const data = { days: 26, firstDay: 5, prevMonthDays: 31 }

const MyDatePicker = ({ isVisible, setIsVisible, displayDate: inputDisplayDate, mode, onConfirm }) => {
    const [btnDisabled, setBtnDisabled] = useState(false);
    const sevenDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const [displayDate, setDisplayDate] = useState(inputDisplayDate || new Date());
    const Time = {
        year: displayDate.getFullYear(),
        month: displayDate.getMonth(), // 0-base
        date: displayDate.getDate(),
    }
    const [output, setOutput] = useState({ date: displayDate, startDate: null, endDate: null });

    const data = useDaysOfMonth(displayDate)

    const Key = ({ eachDay }) => {

        const onKeyPress = () => {
            if (mode === 'single') {
                let setTo = {
                    date: new Date(eachDay.year, eachDay.month, eachDay.date),
                    startDate: null,
                    endDate: null,
                }
                setOutput(setTo)
            }
            if (mode === 'range') {
                if (output.startDate === null | output.endDate !== null) {
                    let setTo = {
                        date: null,
                        startDate: new Date(eachDay.year, eachDay.month, eachDay.date),
                        endDate: null,
                    }
                    setOutput(setTo)
                } else {
                    let setTo = {
                        ...output,
                        endDate: new Date(eachDay.year, eachDay.month, eachDay.date)
                    }
                    setOutput(setTo)
                }
            }
        }
        const getBackgroundColor = () => {
            if (mode === 'single') {
                if (eachDay.month === output.date.getMonth() & eachDay.date === output.date.getDate()) return 'skyblue'
                else return 'white'

            }
        }
        return (
            <TouchableOpacity onPress={onKeyPress}
                style={[styles.keys, { opacity: eachDay.textOpacity, backgroundColor: getBackgroundColor() }]}>
                <Text style={styles.keys_text}>{eachDay.date}</Text>
            </TouchableOpacity>
        )
    }


    const onCancelPress = () => { setIsVisible(false); setOutput({ date: new Date(), startDate: null, endDate: null }) }
    const onConfirmPress = () => {
        setIsVisible(false)
        if (mode === 'single') {
            onConfirm(output.date)
        }
        if (mode === 'range') {

        }
    }
    const onPrev = () => {
        setBtnDisabled(true)
        setDisplayDate(new Date(Time.year, Time.month - 1, Time.date))
    }
    const onNext = () => {
        setBtnDisabled(true)
        setDisplayDate(new Date(Time.year, Time.month + 1, Time.date))
    }

    useEffect(() => {
        setTimeout(setBtnDisabled, 150, false)
    }, [btnDisabled])

    return (
        <Modal
            isVisible={isVisible}
            useNativeDriver
            hideModalContentWhileAnimating
            onBackButtonPress={onCancelPress}
            onBackdropPress={onCancelPress}
            style={{ alignItems: 'center', padding: 0, margin: 0 }}
        >
            <View style={styles.modal_container}>

                <View style={{ flexDirection: 'row', width: 300, justifyContent: 'space-between', alignItems: 'center', }}>
                    <TouchableOpacity style={styles.changeMonthTO} onPress={onPrev} disabled={btnDisabled} >
                        <Text>Prev</Text>
                    </TouchableOpacity>
                    <Text>{Time.year}</Text>
                    <Text>{getMonthInChinese(Time.month)}</Text>
                    <TouchableOpacity style={styles.changeMonthTO} onPress={onNext} disabled={btnDisabled} >
                        <Text>Next</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.keys_container}>
                    {
                        sevenDays.map((n, i) => (
                            <View style={styles.keys} key={i}><Text style={{ color: 'skyblue', fontSize: 16, }}>{n}</Text></View>
                        ))
                    }
                    {
                        data.dateArray.map((eachDay, i) => (
                            <Key key={i} eachDay={eachDay} />
                        ))
                    }

                </View>
                <View style={styles.footer}>
                    <View style={styles.btn_box}>
                        <TouchableOpacity style={styles.btn} onPress={onCancelPress}>
                            <Text style={styles.btn_text}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={onConfirmPress}>
                            <Text style={[styles.btn_text, { color: '#4682E9' }]}>確定</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </Modal>
    )
}

MyDatePicker.proptype = {
    isVisible: PropTypes.bool,
    setIsVisible: PropTypes.func,
    text: PropTypes.string,

}

export default MyDatePicker

const styles = StyleSheet.create({
    modal_container: {
        width: '100%',
        paddingTop: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    keys_container: {
        borderWidth: 1,
        width: 300,
        height: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    keys: {
        // borderWidth: 1,
        width: 36,
        height: 36,
        borderRadius: 10,
        marginTop: 4,
        marginRight: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keys_text: {
        fontSize: 16,
    },
    footer: {
        borderWidth: 1,
        width: '100%',
        height: 52,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    btn_box: {
        width: 130,
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
    },
    btn: {
        width: 54,
        height: 36,
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text: {
        fontSize: 18,
        // lineHeight: 22,

    },
    changeMonthTO: {
        padding: 4,
        borderWidth: 1,
        borderColor: 'black',

    }
});