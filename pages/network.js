import React from "react";
import { GroupPanel } from "../components/panel";
import { Container, Typography, Grid, Paper, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { blue, grey } from "@material-ui/core/colors";

export async function getStaticProps(context) {
    let groups = [
        {
            groupId: "1",
            groupName: "分组1",
            order: 1
        },
        {
            groupId: "2",
            groupName: "分组2",
            order: 2
        },
        {
            groupId: "3",
            groupName: "分组分组分组分组分组分组分组3",
            order: 3
        },
        {
            groupId: "4",
            groupName: "分组4",
            order: 4
        },
        {
            groupId: "5",
            groupName: "分组5",
            order: 5
        },
        {
            groupId: "6",
            groupName: "分组6",
            order: 6
        }
    ]

    return {
        props: {
            groups
        },
    }
}

export default class Network extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        const { groups } = this.props
        return (
            <Grid container spacing={0} style={{ height: '100vh', width: '100vw' }}>
                <Grid item xs={1} style={{ border: '1px solid blue' }}>
                    <Box id='nav' display='flex' style={{ height: '100vh' }} flexDirection='column' spacing={0}>
                        <Box id='avatar' style={{ height: '10vh', padding: '5px' }}>
                            <div style={{ border: '1px solid gray' }}>avatar</div>
                        </Box>
                        <Box id='menu-group' display='flex' flexDirection='column' style={{ height: '80vh' }}>
                            <Grid container alignItems='center' spacing={1} direction='column'>
                                {[0, 1, 2].map((value) => (
                                    <Grid key={value} item>
                                        <div style={{ border: '1px solid gray' }}>{value}</div>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                        <Box id='settings' style={{ height: '10vh', padding: '5px' }}>
                            <div style={{ border: '1px solid gray' }}>settings</div>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={11} style={{ border: '1px solid blue' }}>
                    <Paper />
                </Grid>
            </Grid>
        )
    }

}