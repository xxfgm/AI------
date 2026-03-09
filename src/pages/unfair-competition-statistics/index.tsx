/**
 * @name 不正当竞争案件统计表
 */
import React, { useState } from 'react';
import { DatePicker, Radio, Button, Table, Cascader, Flex } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { agencyData } from '../law-enforcement-statistics/agencyData';
import './style.css';

const { RangePicker } = DatePicker;

interface UnfairData {
    key: string;
    category1?: string;
    rowSpan1?: number;
    category2?: string;
    rowSpan2?: number;
    indicatorName: string;
    code: string | number;
    totalCases: number | string;
    caseValue: number | string;
    fineAmount: number | string;
    confiscatedAmount: number | string;
    transferredToDept: number | string;
    transferredToJudicial: number | string;
    enforcementMeasures: number | string;
    internetRelated: number | string;
}

const mockData: UnfairData[] = [
    { key: 't1', indicatorName: '甲', code: '乙', totalCases: 1, caseValue: 2, fineAmount: 3, confiscatedAmount: 4, transferredToDept: 5, transferredToJudicial: 6, enforcementMeasures: 7, internetRelated: 8 },
    { key: 't2', indicatorName: '合计', code: '1', totalCases: 122, caseValue: 223.616491, fineAmount: 207.215555, confiscatedAmount: 16.400936, transferredToDept: 3, transferredToJudicial: 1, enforcementMeasures: 2, internetRelated: 60 },
    
    // 侵犯知识产权不正当竞争行为 (L1) -> 混淆行为 (L2) - 5 rows
    { key: '2', category1: '侵犯\n知识\n产权\n不正当\n竞争\n行为', rowSpan1: 10, category2: '混淆\n行为', rowSpan2: 5, indicatorName: '小计', code: '2', totalCases: 12, caseValue: 21.235058, fineAmount: 21.147888, confiscatedAmount: 0.08717, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 6 },
    { key: '3', indicatorName: '擅自使用与他人有一定影响的商品名称、包装、装潢等相同或者近似的标识', code: '3', totalCases: 5, caseValue: 9.062846, fineAmount: 9.062846, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 1 },
    { key: '4', indicatorName: '擅自使用他人有一定影响的企业名称 (包括简称、字号等)、社会组织名称 (包括简称等)、姓名 (包括笔名、艺名、译名等)', code: '4', totalCases: 1, caseValue: 0.2, fineAmount: 0.2, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 1 },
    { key: '5', indicatorName: '擅自使用他人有一定影响的域名主体部分、网站名称、网页等', code: '5', totalCases: 1, caseValue: 5.285042, fineAmount: 5.285042, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 1 },
    { key: '6', indicatorName: '其他足以引人误认为是他人商品或者与他人存在特定联系的混淆行为', code: '6', totalCases: 5, caseValue: 6.68717, fineAmount: 6.6, confiscatedAmount: 0.08717, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 3 },

    // 侵犯商业秘密 (L2) - 5 rows
    { key: '7', category2: '侵犯\n商业\n秘密', rowSpan2: 5, indicatorName: '以盗窃、贿赂、欺诈、胁迫、利诱或者其他不正当手段获取权利人的商业秘密', code: '7', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },
    { key: '8', indicatorName: '披露、使用或者允许他人使用以前项手段获取的权利人的商业秘密', code: '8', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },
    { key: '9', indicatorName: '违反保密义务或者违反权利人有关保守商业秘密的要求，披露、使用或者允许他人使用其所掌握的商业秘密', code: '9', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },
    { key: '10', indicatorName: '教唆、引诱、帮助他人违反保密义务或者违反权利人有关保守商业秘密的要求，获取、披露、使用或者允许他人使用权利人的商业秘密', code: '10', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },
    { key: '11', indicatorName: '第三人明知或者应知商业秘密权利人的员工、前员工或者其他单位、个人实施前款所列违法行为，仍获取、披露、使用或者允许他人使用', code: '11', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },

    // 商业贿赂 - 4 rows
    { key: '12', category1: '商业\n贿赂', rowSpan1: 4, indicatorName: '小计', code: '12', totalCases: 5, caseValue: 48.147766, fineAmount: 32.5, confiscatedAmount: 15.647766, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },
    { key: '13', indicatorName: '贿赂交易相对方工作人员', code: '13', totalCases: 1, caseValue: 1, fineAmount: 1, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },
    { key: '14', indicatorName: '贿赂受交易相对方委托的单位或者个人', code: '14', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },
    { key: '15', indicatorName: '贿赂影响交易的单位或者个人', code: '15', totalCases: 4, caseValue: 47.147766, fineAmount: 31.5, confiscatedAmount: 15.647766, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },

    // 虚假或引人误解的商业宣传 - 3 rows
    { key: '16', category1: '虚假或\n引人误解的\n商业宣传', rowSpan1: 3, indicatorName: '小计', code: '16', totalCases: 91, caseValue: 146.784467, fineAmount: 146.167667, confiscatedAmount: 0.6168, transferredToDept: 3, transferredToJudicial: 1, enforcementMeasures: 2, internetRelated: 45 },
    { key: '17', indicatorName: '对商品性能、功能、质量、销售状况、用户评价、曾获荣誉等作虚假或引人误解的商业宣传', code: '17', totalCases: 90, caseValue: 142.784467, fineAmount: 142.167667, confiscatedAmount: 0.6168, transferredToDept: 3, transferredToJudicial: 1, enforcementMeasures: 2, internetRelated: 44 },
    { key: '18', indicatorName: '通过组织虚假交易等方式，帮助其他经营者进行虚假或引人误解的商业宣传', code: '18', totalCases: 1, caseValue: 4, fineAmount: 4, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 1 },

    // 不正当有奖销售 - 4 rows
    { key: '19', category1: '不正当\n有奖销售', rowSpan1: 4, indicatorName: '小计', code: '19', totalCases: 2, caseValue: 5, fineAmount: 5, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 1 },
    { key: '20', indicatorName: '所设奖的种类、兑奖条件、奖金金额或者奖品等有奖销售信息不明确，影响兑奖', code: '20', totalCases: 2, caseValue: 5, fineAmount: 5, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 1 },
    { key: '21', indicatorName: '采用谎称有奖或者故意让内定人员中奖的欺骗方式进行有奖销售', code: '21', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },
    { key: '22', indicatorName: '抽奖式的有奖销售，最高奖的金额超过五万元', code: '22', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },

    // 商业诋毁
    { key: '23', category1: '商业诋毁', rowSpan1: 1, indicatorName: '编造、传播虚假信息或者误导性信息，损害竞争对手的商业信誉、商品声誉', code: '23', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },

    // 网络新型不正当竞争行为 - 5 rows
    { key: '24', category1: '网络\n新型\n不正当\n竞争\n行为', rowSpan1: 5, indicatorName: '小计', code: '24', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },
    { key: '25', indicatorName: '未经其他经营者同意，在其合法提供的网络产品或者服务中，插入链接、强制进行目标跳转', code: '25', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },
    { key: '26', indicatorName: '误导、欺骗、强迫用户修改、关闭、卸载其他经营者合法提供的网络产品或者服务', code: '26', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },
    { key: '27', indicatorName: '恶意对其他经营者合法提供的网络产品或者服务实施不兼容', code: '27', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },
    { key: '28', indicatorName: '其他妨碍、破坏其他经营者合法提供的网络产品或者服务正常运行的行为', code: '28', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },

    // Footer items
    { key: '29', indicatorName: '妨害监督检查部门依照本法履行职责，拒绝、阻碍调查', code: '29', totalCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 0 },
    { key: '30', indicatorName: '其他', code: '30', totalCases: 12, caseValue: 2.4492, fineAmount: 2.4, confiscatedAmount: 0.0492, transferredToDept: 0, transferredToJudicial: 0, enforcementMeasures: 0, internetRelated: 8 },
];

const Component: React.FC = () => {
    const [reportType, setReportType] = useState('monthly');

    const renderDataCell = (text: any, record: any) => {
        if (['t1', 't2'].includes(record.key)) return text;
        const num = Number(text);
        if (isNaN(num)) return text;
        return num > 0 ? <span style={{ color: '#2563eb', cursor: 'pointer' }}>{text}</span> : text;
    };

    const columns: TableProps<UnfairData>['columns'] = [
        {
            title: '',
            dataIndex: 'category1',
            key: 'category1',
            align: 'center',
            width: 80,
            onCell: (record) => {
                const isHeader = ['t1', 't2'].includes(record.key);
                const isFooter = ['29', '30'].includes(record.key);
                
                if (isHeader) return { colSpan: 3 };
                if (isFooter) return { colSpan: 2, rowSpan: 1 };

                const spanBoth = ['12', '16', '19', '23', '24'].includes(record.key);
                if (spanBoth) return { colSpan: 2, rowSpan: record.rowSpan1 || 1 };
                
                // Rows under a merged rowSpan1, colSpan2 area should be hidden
                const underSpanBoth = ['13', '14', '15', '17', '18', '20', '21', '22', '25', '26', '27', '28'].includes(record.key);
                if (underSpanBoth) return { colSpan: 0, rowSpan: 0 };

                if (record.category1) return { rowSpan: record.rowSpan1, colSpan: 1 };
                return { rowSpan: 0 };
            },
            render: (text, record) => {
                if (['t1', 't2', '29', '30'].includes(record.key)) {
                    const isMainHeader = ['甲', '合计'].includes(record.indicatorName);
                    return (
                        <div style={{
                            fontWeight: isMainHeader ? 600 : 400,
                            color: isMainHeader ? '#111' : '#4b5563',
                            textAlign: 'center',
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6
                        }}>
                            {record.indicatorName}
                        </div>
                    );
                }
                return <div className="category-text">{text}</div>;
            }
        },
        {
            title: '',
            dataIndex: 'category2',
            key: 'category2',
            align: 'center',
            width: 80,
            onCell: (record) => {
                if (['t1', 't2', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'].includes(record.key)) return { colSpan: 0 };
                if (record.category2) return { rowSpan: record.rowSpan2 };
                return { rowSpan: 0 };
            },
            render: (text) => <div className="category-text">{text}</div>
        },
        {
            title: '指标名称',
            dataIndex: 'indicatorName',
            key: 'indicatorName',
            width: 400,
            onCell: (record) => {
                if (['t1', 't2', '29', '30'].includes(record.key)) return { colSpan: 0 };
                return {};
            },
            render: (text, record) => {
                const isHeader = ['甲', '合计'].includes(text);
                const isSubHeader = text === '小计';
                return (
                    <div style={{
                        paddingLeft: isHeader ? 0 : 16,
                        fontWeight: isHeader || isSubHeader ? 600 : 400,
                        color: isHeader || isSubHeader ? '#111' : '#4b5563',
                        textAlign: isHeader ? 'center' : 'left'
                    }}>
                        {text}
                    </div>
                );
            }
        },
        {
            title: '代码',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            width: 60,
        },
        { title: '案件总数 (件)', dataIndex: 'totalCases', key: 'totalCases', align: 'center', width: 90, render: renderDataCell },
        { title: '案值 (万元)', dataIndex: 'caseValue', key: 'caseValue', align: 'center', width: 110, render: (t) => t },
        { title: '罚款金额 (万元)', dataIndex: 'fineAmount', key: 'fineAmount', align: 'center', width: 110, render: (t) => t },
        { title: '没收金额 (万元)', dataIndex: 'confiscatedAmount', key: 'confiscatedAmount', align: 'center', width: 110, render: (t) => t },
        { title: <div style={{ fontSize: 13, lineHeight: 1.2 }}>移送有关<br/>部门案件数<br/>(件)</div>, dataIndex: 'transferredToDept', key: 'transferredToDept', align: 'center', width: 90, render: renderDataCell },
        { title: '移送司法机关', dataIndex: 'transferredToJudicial', key: 'transferredToJudicial', align: 'center', width: 90, render: renderDataCell },
        { title: '适用强制措施 (件)', dataIndex: 'enforcementMeasures', key: 'enforcementMeasures', align: 'center', width: 90, render: renderDataCell },
        { title: '利用网络 (件)', dataIndex: 'internetRelated', key: 'internetRelated', align: 'center', width: 90, render: renderDataCell },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col p-6">
            <div className="w-full max-w-[1700px] mx-auto">
                <div style={{ padding: '24px 0 32px 0', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', letterSpacing: '0.05em', margin: 0 }}>不正当竞争案件统计表</h1>
                </div>

                <Flex justify="space-between" align="center" style={{ marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
                    <Flex gap={32} align="center" style={{ minWidth: 'max-content' }}>
                        <Flex gap={8} align="center">
                            <span style={{ fontSize: 14, color: '#4b5563', whiteSpace: 'nowrap' }}>办案机构：</span>
                            <Cascader
                                style={{ width: 256 }}
                                placeholder="请选择办案机构"
                                options={agencyData}
                                changeOnSelect
                                allowClear
                                showSearch={{ filter: (inputValue, path) => path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) }}
                            />
                        </Flex>

                        <Flex gap={8} align="center">
                            <span style={{ fontSize: 14, color: '#4b5563', whiteSpace: 'nowrap' }}>处罚决定日期：</span>
                            <RangePicker style={{ width: 280 }} placeholder={['开始日期', '结束日期']} />
                        </Flex>

                        <Radio.Group onChange={(e) => setReportType(e.target.value)} value={reportType} style={{ marginLeft: 8 }}>
                            <Radio value="monthly">月报</Radio>
                            <Radio value="q1">一季报</Radio>
                            <Radio value="q2">二季报</Radio>
                            <Radio value="q3">三季报</Radio>
                            <Radio value="yearly">年报</Radio>
                        </Radio.Group>
                    </Flex>

                    <Flex gap={8} align="center" style={{ marginLeft: 16, minWidth: 'max-content' }}>
                        <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#2563eb' }}>查询</Button>
                        <Button icon={<ExportOutlined />}>导出</Button>
                    </Flex>
                </Flex>

                <div className="w-full pb-8">
                    <Table
                        dataSource={mockData}
                        columns={columns}
                        pagination={false}
                        bordered
                        size="middle"
                        className="plain-styled-table"
                        scroll={{ x: 1500 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Component;
