
import styles from '../styles/Panel.module.css'
import React from 'react'
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheck, faEdit, faList, faPlus, faSort, faSortNumericDownAlt, faSortNumericUpAlt, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons'

export class GroupPanel extends React.Component {

    constructor(props) {
        console.log('props:' + props)
        super(props)
        this.state = {
            showOptions: false,
            showNewGroupPanel: false,
            selectedOption: {
                groupId: '',
                groupName: '自选',
                order: 0
            }
        }
    }

    handleClick = (group) => {
        this.toggleGroupOptions()
    }

    handleSelect = (group) => {
        console.log('handleGroupItemClick:', group)
        this.setState({
            selectedOption: group
        })
        this.toggleGroupOptions()
    }

    toggleGroupOptions = () => {
        const { showOptions } = this.state
        this.setState({
            showOptions: !showOptions
        })
    }

    // 拖动
    handleDrag = () => {
        // const { groups } = this.state
        // todo drag logic
    }

    // 拖放
    handleDrop = (group, targetGroupId) => {
        console.log('drop', group)
        const { groups } = this.props
        let targetGroupIndex = groups.findIndex((item) => item.groupId === targetGroupId)
        let targetGroup = groups[targetGroupIndex]
        groups.splice(targetGroupIndex, 1)
        let toGroupIndex = groups.findIndex((item => item.groupId === group.groupId))
        if (targetGroup.order < group.order) {
            groups.splice(toGroupIndex + 1, 0, targetGroup)
        } else {
            groups.splice(toGroupIndex, 0, targetGroup)
        }
        groups.forEach((item, index) => {
            item.order = index + 1
        })
        this.setState({
            groups: groups
        })
    }

    handleDel = (group) => {
        const { groups } = this.props
        let groupIndex = groups.findIndex((item) => item.groupId === group.groupId)
        if (groupIndex !== -1) {
            groups.splice(groupIndex, 1)
            this.setState({
                groups: groups
            })
        }
    }

    handleNewGroup = () => {
        this.toggleNewGroupPanel(true)
    }

    toggleNewGroupPanel = (show) => {
        this.setState({
            showNewGroupPanel: show
        })
    }

    render() {
        console.log('props:' + JSON.stringify(this.props))
        const { groups } = this.props
        const { showOptions, selectedOption, showNewGroupPanel } = this.state
        const style = {
            contentVisibility: showOptions === true ? 'visible' : 'hidden'
        }
        return (
            <div className={styles.GroupPanel}>
                < div className={styles.GroupOption} >
                    <div className={styles.SelectOption} onClick={this.handleClick}>
                        <div className={styles.OptionName}>{selectedOption.groupName}</div>
                        <Icon className={styles.PullDown} title='展开' icon={faAngleDown} />
                    </div>
                    <div className={styles.OptionTool}>
                        <Icon className={styles.GroupAdd} title='新建' icon={faPlus} onClick={this.handleNewGroup} />
                        <Icon className={styles.GroupRefresh} title='刷新' icon={faSyncAlt} />
                    </div>
                </div >
                <div className={styles.GroupOption} style={style}>
                    {
                        groups.map((group) => <GroupItem key={group.groupId} group={group} selectHandler={this.handleSelect} delHandler={this.handleDel} dragHandler={this.handleDrag} dropHandler={this.handleDrop} />)
                    }
                </div>
                {
                    showNewGroupPanel ? <NewGroupPanel togglePanelHandler={this.toggleNewGroupPanel} /> : null
                }
            </div >
        )
    }
}

class GroupItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            group: this.props.group,
            readonly: true,
            draggable: false,
            cursor: 'initial',
            borderBottom: 'none',
            borderTop: 'none'
        }
    }
    // 内容变化
    handleChange = (e) => {
        const { group } = this.state
        group.groupName = e.target.value
        this.setState({
            group: group
        })
    }
    // 编辑
    handleEdit = () => {
        this.setState({
            readonly: false
        })
    }
    // 删除
    handleDel = () => {
        // call del api and nofify parent component
        const { group } = this.state
        const { delHandler } = this.props
        delHandler(group)
    }
    // 取消编辑
    handleCancel = () => {
        this.setState({
            readonly: true
        })
    }
    // 确认编辑
    handleConfirm = (e) => {
        // call modify api
        this.setState({
            readonly: true
        })
    }

    handleDragStart = (e) => {
        const { group } = this.props
        e.dataTransfer.setData("text/plain", group.groupId);
        this.setState({
            cursor: 'grabbing'
        })
    }

    handleDragEnd = () => {
        // this.setState({
        //     cursor: 'initial'
        // })
        this.setState({
            borderTop: 'none',
            borderBottom: 'none'
        })
    }

    handleDrag = () => {
        const { group } = this.props
        // console.log("drag", group.groupId)
        const { dragHandler } = this.props
        dragHandler(group)
    }

    handleDrop = (e) => {
        console.log('drop', e.currentTarget)
        const targetGroupId = e.dataTransfer.getData("text/plain")
        const { group, dropHandler } = this.props
        this.setState({
            cursor: 'grab'
        })
        dropHandler(group, targetGroupId)

    }

    handleMouseUp = () => {
        this.setState({
            cursor: 'move'
        })
    }

    handleMouseDown = () => {
        this.setState({
            cursor: 'grab'
        })
    }

    handleMouseEnter = () => {
        this.setState({
            draggable: true,
            cursor: 'move'
        })
    }

    handleMouseLeave = () => {
        this.setState({
            draggable: false,
            cursor: 'initial'
        })
    }

    // handleMove = (e) => {
    //     const { group } = this.props
    //     console.log('drag', e.type, group.groupId, e.currentTarget)
    //     e.dataTransfer.dropEffect = 'move'

    //     let top = e.currentTarget.getBoundingClientRect().top;
    //     let bottom = e.currentTarget.getBoundingClientRect().bottom
    //     let middle = (top + bottom) / 2;
    //     console.log(e.type, 'groupId', group.groupId, 'top', top, 'bottom:', bottom, 'middle', middle,
    //         'clientY', e.clientY)
    //     if (top < e.clientY && e.clientY < middle) {
    //         this.setState({
    //             borderTop: 'solid',
    //             borderBottom: 'none'
    //         })
    //     } else if (middle < e.clientY && e.clientY < bottom) {
    //         this.setState({
    //             borderTop: 'none',
    //             borderBottom: 'solid'
    //         })
    //     } else {
    //         this.setState({
    //             borderTop: 'none',
    //             borderBottom: 'none'
    //         })
    //     }
    //     e.preventDefault()
    // }

    handleDragOver = (e) => {
        e.preventDefault()
    }

    handleClick = () => {
        console.log("click")
        const { group } = this.state
        const { selectHandler } = this.props
        selectHandler(group)
    }

    render() {
        const { group, readonly, draggable, cursor, borderBottom, borderTop } = this.state
        const style = {
            cursor: cursor,
            borderBottom: borderBottom,
            borderTop: borderTop
        }
        let toolDiv = readonly ? (
            <div className={styles.GroupTool}>
                <div className={styles.GroupName} title={group.groupName} onClick={this.handleClick}>{group.groupName}</div>
                <div className={styles.GroupEdit}><Icon icon={faEdit} title='编辑' onClick={this.handleEdit} /></div>
                <div className={styles.GroupDel}><Icon icon={faTimes} title='删除' onClick={this.handleDel} /></div>
            </div>
        ) : (
            <div className={styles.GroupTool}>
                <input type='text' className={styles.GroupName} value={group.groupName} onChange={this.handleChange} />
                <Icon className={styles.GroupCancel} icon={faTimes} title='取消' onClick={this.handleCancel} />
                <Icon className={styles.GroupConfirm} icon={faCheck} title='确认' onClick={this.handleConfirm} />
            </div>
        )
        return (
            <div className={styles.GroupItem} draggable={draggable} onDrag={this.handleDrag} onDrop={this.handleDrop} onDragStart={this.handleDragStart} onDragEnd={this.handleDragEnd} onDragOver={this.handleDragOver} style={style}>
                <Icon className={styles.GroupSort} icon={faSort} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} />
                {toolDiv}
            </div>
        )
    }
}

class NewGroupPanel extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            groupName: '',
            isDefault: false
        }
    }

    handleCancel = () => {
        const { togglePanelHandler } = this.props
        togglePanelHandler(false)
    }

    handleConfirm = () => {
        const { togglePanelHandler } = this.props
        togglePanelHandler(false)
    }

    changeGroupName = (e) => {
        this.setState({
            groupName: e.target.value
        })
    }

    changeIsDefault = (e) => {
        console.log(e.target.value)
        this.setState({
            isDefault: e.target.value
        })
    }

    render() {
        return (
            <div className={styles.GroupAddPanel}>
                <form className={styles.GroupAddForm}>
                    <input type='text' className={styles.NewGroupName} onChange={this.changeGroupName} />
                    <div className={styles.GroupDefault}>
                        <input type='checkbox' id='group-default-box' className={styles.GroupDefaultBox} onChange={this.changeIsDefault} />
                        <label className={styles.GroupDefaultLabel} htmlFor='group-default-box'>默认</label>
                    </div>
                </form>
                <div className={styles.GroupAddTool}>
                    <Icon className={styles.GroupCancel} icon={faTimes} title='取消' onClick={this.handleCancel} />
                    <Icon className={styles.GroupConfirm} icon={faCheck} title='确认' onClick={this.handleConfirm} />
                </div>
            </div>
        )
    }
}