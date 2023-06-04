import { StyleSheet, Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;
const photoSize = screenWidth / 3 - 10;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111A21',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 60,
        color: '#138E8E',
        fontFamily: 'serif',
    },
    buttonText: {
        fontSize: 15,
        color: '#fff',
        fontFamily: 'serif',
    },
    infoContainer: {
        width: 330,
        height: 300,
        backgroundColor: '#004B5C',
        borderRadius: 30,
        padding: 20,
        marginBottom: 20,
    },
    infoText: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'serif',
        color: '#fff',
        margin: 10
    },
    infoTextSub: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'serif',
        color: '#fff',
        margin: 10
    },
    toggleCameraButton: {
        position: 'absolute',
        bottom: 30,
        right: 60,
        padding: 10,
    },
    buttonCameraContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 5,
        borderColor: '#fff',
    },
    cameraContainer: {
        flex: 1,
        alignSelf: 'stretch',
    },
    preview: {
        flex: 1,
        alignSelf: 'stretch',
    },
    thumbnail: {
        width: photoSize,
        height: photoSize,
        margin: 5,
    },
    cameraButton: {
        width: 150,
        height: 170,
        borderRadius: 20,
        backgroundColor: '#004B5C',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    galleryButton: {
        width: 150,
        height: 170,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        backgroundColor: '#004B5C',
        alignItems: 'center',
        marginBottom: 10,
    },
    goBackButton: {
        position: 'absolute',
        top: 30,
        left: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        zIndex: 1,
    },
    goBackButtonCamera: {
        position: 'absolute',
        top: 30,
        left: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        zIndex: 1,
    },
    photosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: 70,
        backgroundColor: '#004B5C',
        paddingBottom: 70,
    },
});

export { styles };
