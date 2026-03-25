/**
 * @name 认证认可与检验检测案件统计表
 */
import React, { useState } from 'react';
import { DatePicker, Radio, Button, Table, Cascader, Flex } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { agencyData } from '../law-enforcement-statistics/agencyData';
import './style.css';

const { RangePicker } = DatePicker;

interface CertData {
    key: string;
    category?: string;
    rowSpan?: number;
    indicatorName: string;
    code: string | number;
    totalCases: number | string;
    normalCases: number | string;
    amount: number | string;
    fineAmount: number | string;
    confiscatedAmount: number | string;
    transferredCases: number | string;
}

const mockData: CertData[] = [
    { key: 't1', indicatorName: '甲', code: '乙', totalCases: 1, normalCases: 2, amount: 3, fineAmount: 4, confiscatedAmount: 5, transferredCases: 6 },
    { key: 't2', indicatorName: '合计', code: '1', totalCases: 58, normalCases: 54, amount: 50.74516, fineAmount: 43.641293, confiscatedAmount: 7.103867, transferredCases: 0 },
    // 强制性产品认证
    { key: '1', category: '强制性\n产品\n认证', rowSpan: 2, indicatorName: '强制性产品认证违法行为', code: '2', totalCases: 37, normalCases: 35, amount: 2.66056, fineAmount: 2.359093, confiscatedAmount: 0.301467, transferredCases: 0 },
    { key: '2', indicatorName: '其中：未经强制性产品认证，擅自出厂、销售、进口或者在其他经营活动中使用', code: '3', totalCases: 5, normalCases: 4, amount: 0.2282, fineAmount: 0.2251, confiscatedAmount: 0.0031, transferredCases: 0 },
    // 自愿性认证
    { key: '3', category: '自愿\n性\n认证', rowSpan: 8, indicatorName: '认证机构违法行为', code: '4', totalCases: 1, normalCases: 1, amount: 2.5, fineAmount: 2, confiscatedAmount: 0.5, transferredCases: 0 },
    { key: '4', indicatorName: '其中：未经批准擅自从事认证活动', code: '5', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '5', indicatorName: '       超出批准范围从事认证活动', code: '6', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '6', indicatorName: '       增加、减少、遗漏认证规则、认证基本规范规定的程序', code: '7', totalCases: 1, normalCases: 1, amount: 2.5, fineAmount: 2, confiscatedAmount: 0.5, transferredCases: 0 },
    { key: '7', indicatorName: '       未对其认证的产品、服务、管理体系实施有效跟踪调查', code: '8', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '8', indicatorName: '       出具虚假认证结论或者认证结论严重失实', code: '9', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '9', indicatorName: '认证人员违法行为', code: '10', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '10', indicatorName: '认证获证组织违法行为', code: '11', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    // 检验检测
    { key: '11', category: '检验\n检测', rowSpan: 8, indicatorName: '资质认定违法行为', code: '12', totalCases: 5, normalCases: 5, amount: 9.7, fineAmount: 9.7, confiscatedAmount: 0, transferredCases: 0 },
    { key: '12', indicatorName: '其中：检验检测机构未依法取得资质认定，擅自向社会出具具有证明作用的数据、结果的', code: '13', totalCases: 2, normalCases: 2, amount: 3.3, fineAmount: 3.3, confiscatedAmount: 0, transferredCases: 0 },
    { key: '13', indicatorName: '      基本条件和技术能力不能持续符合资质认定条件和要求，擅自向社会出具有证明作用的检验检测数据、结果的', code: '14', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '14', indicatorName: '      超出资质认定证书规定的检验检测能力范围，擅自向社会出具具有证明作用的数据、结果的', code: '15', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '15', indicatorName: '      转让、出租、出借资质认定证书或者标志，伪造、变造、冒用资质认定证书或者标志，使用已经过期或者被撤销、注销的资质认定证书或者标志的', code: '16', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '16', indicatorName: '检验检测违法行为', code: '17', totalCases: 7, normalCases: 7, amount: 32.1024, fineAmount: 25.8, confiscatedAmount: 6.3024, transferredCases: 0 },
    { key: '17', indicatorName: '其中：出具不实检验检测报告', code: '18', totalCases: 4, normalCases: 4, amount: 10.392, fineAmount: 10.3, confiscatedAmount: 0.092, transferredCases: 0 },
    { key: '18', indicatorName: '      出具虚假检验检测报告', code: '19', totalCases: 3, normalCases: 3, amount: 21.7104, fineAmount: 15.5, confiscatedAmount: 6.2104, transferredCases: 0 },
];

const Component: React.FC = () => {
    const [reportType, setReportType] = useState('monthly');

    const columns: TableProps<CertData>['columns'] = [
        {
            title: '',
            dataIndex: 'category',
            key: 'category',
            align: 'center',
            width: 80,
            onCell: (record) => {
                if (record.category) {
                    return { rowSpan: record.rowSpan };
                }
                if (['t1', 't2'].includes(record.key)) {
                    return { colSpan: 0 };
                }
                return { rowSpan: 0 };
            },
            render: (text) => <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#111', fontWeight: 500, padding: '4px' }}>{text}</div>
        },
        {
            title: '指标名称',
            dataIndex: 'indicatorName',
            key: 'indicatorName',
            width: 320,
            onCell: (record) => {
                if (['t1', 't2'].includes(record.key)) {
                    return { colSpan: 2 }; // Span across category and indicatorName
                }
                return {};
            },
            render: (text) => {
                const isHeader = ['甲', '合计'].includes(text);
                const isSubHeader = text.includes('违法行为') && !text.includes('其中：');

                let paddingLeft = 16; // 默认左侧一点留白，比紧贴好
                if (isHeader || isSubHeader) paddingLeft = 16;
                else if (text.startsWith('其中：')) paddingLeft = 32;
                else if (text.startsWith('       ')) {
                    // 替换前置空格为空，然后增加 padding
                    text = text.trim();
                    paddingLeft = 72; // 深层缩进
                } else if (text.startsWith('      ')) {
                    text = text.trim();
                    paddingLeft = 72; // 检验检测下面的深层缩进
                }

                return (
                    <div style={{
                        paddingLeft,
                        paddingTop: 8,
                        paddingBottom: 8,
                        fontWeight: isHeader || isSubHeader ? 600 : 400,
                        color: isHeader || isSubHeader ? '#1f2937' : '#4b5563',
                        textAlign: isHeader ? 'center' : 'left',
                        whiteSpace: 'pre-wrap', // 允许文字换行
                        lineHeight: 1.6
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
            width: 80,
        },
        {
            title: '案件总数（件）',
            key: 'cases',
            children: [
                {
                    title: '',
                    dataIndex: 'totalCases',
                    key: 'totalCases',
                    align: 'center',
                    render: (text) => <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>
                },
                {
                    title: <span style={{ fontSize: 12, fontWeight: 'normal', color: '#666' }}>普通程序</span>,
                    dataIndex: 'normalCases',
                    key: 'normalCases',
                    align: 'center',
                    render: (text) => <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>
                }
            ]
        },
        {
            title: '案值（万元）',
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
            render: (text) => text
        },
        {
            title: '罚款金额（万元）',
            dataIndex: 'fineAmount',
            key: 'fineAmount',
            align: 'center',
            render: (text) => text
        },
        {
            title: '没收金额（万元）',
            dataIndex: 'confiscatedAmount',
            key: 'confiscatedAmount',
            align: 'center',
            render: (text) => text
        },
        {
            title: '移送司法机关案件（件）',
            dataIndex: 'transferredCases',
            key: 'transferredCases',
            align: 'center',
            render: (text) => <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>
        },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col p-6">
            <div className="w-full max-w-[1600px] mx-auto">
                {/* 标题 */}
                <div style={{ padding: '24px 0 32px 0', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', letterSpacing: '0.05em', margin: 0 }}>认证认可与检验检测案件统计表</h1>
                </div>

                {/* 搜索栏 */}
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

                {/* 表格容器 */}
                <div className="w-full pb-8">
                    <Table
                        dataSource={mockData}
                        columns={columns}
                        pagination={false}
                        bordered
                        size="middle"
                        className="plain-styled-table"
                    />
                </div>
            </div>
        </div>
    );
};

export default Component;
