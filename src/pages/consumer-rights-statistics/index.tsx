/**
 * @name 侵害消费者权益案件统计表（按行为分类）
 */
import React, { useState } from 'react';
import { DatePicker, Radio, Button, Table, Cascader, Flex, Typography } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { agencyData } from '../law-enforcement-statistics/agencyData';
import './style.css';

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface ConsumerRightsData {
    key: string;
    sideCategory?: string;
    sideRowSpan?: number;
    indicatorName: string;
    code: string | number;
    totalCases: number | string;
    normalProc: number | string;
    simpleProc: number | string;
    settledCases: number | string;
    coreCases: number | string;
    caseValue: number | string;
    fineAmount: number | string;
    confiscatedAmount: number | string;
    confiscatedIncome: number | string;
    economicLossSaved: number | string;
    seizureCount: number | string;
    transferredCases: number | string;
}

const mockData: ConsumerRightsData[] = [
    { key: 'h1', indicatorName: '甲', code: '乙', totalCases: '1', normalProc: '2', simpleProc: '3', settledCases: '4', coreCases: '5', caseValue: '6', fineAmount: '7', confiscatedAmount: '8', confiscatedIncome: '9', economicLossSaved: '10', seizureCount: '11', transferredCases: '12' },
    { key: '1', indicatorName: '合计', code: '1', totalCases: 163, normalProc: 135, simpleProc: 0, settledCases: 4, coreCases: 17, caseValue: 2, fineAmount: 412.047152, confiscatedAmount: 153.334015, confiscatedIncome: 258.123287, economicLossSaved: 0, seizureCount: 0, transferredCases: 5 },
    { key: '2', sideCategory: '提供的商品或服务', indicatorName: '提供的商品或者服务不符合保障人身、财产安全要求', code: '2', totalCases: 7, normalProc: 11, simpleProc: 0, settledCases: 3, coreCases: 1, caseValue: 0, fineAmount: 4.372484, confiscatedAmount: 4.872, confiscatedIncome: 0.470484, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '3', sideCategory: '提供的商品或服务', indicatorName: '提供的商品或者服务不符合保障人身、财产安全要求，或者有关行政部门责令对缺陷商品或者服务采取停止销售、警示、召回、无害化处理、销毁、停止生产或者服务等措施', code: '3', totalCases: 4, normalProc: 4, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0.18388, confiscatedAmount: 0.1, confiscatedIncome: 0.78388, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '4', sideCategory: '掺杂、掺假、以假充真', indicatorName: '在商品中掺杂、掺假、以假充真、以次充好，或者以不合格产品冒充合格产品', code: '4', totalCases: 135, normalProc: 104, simpleProc: 0, settledCases: 1, coreCases: 9, caseValue: 2, fineAmount: 260.674938, confiscatedAmount: 115.904256, confiscatedIncome: 144.970532, economicLossSaved: 0, seizureCount: 0, transferredCases: 5 },
    { key: '5', sideCategory: '掺杂、掺假、以假充真', indicatorName: '生产国家明令淘汰的商品或者销售失效、变质的商品', code: '5', totalCases: 0, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '6', sideCategory: '掺杂、掺假、以假充真', indicatorName: '伪造商品产地，伪造或者冒用他人厂名、厂址，篡改生产日期，伪造或者冒用认证标志等质量标志', code: '6', totalCases: 0, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '7', sideCategory: '检验、检疫', indicatorName: '销售的商品应检验、检疫而未检验、检疫或伪造检验、检疫结果', code: '7', totalCases: 11, normalProc: 11, simpleProc: 0, settledCases: 0, coreCases: 7, caseValue: 0, fineAmount: 32.7412, confiscatedAmount: 32.7412, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '8', sideCategory: '虚假宣传', indicatorName: '对商品或者服务作虚假或者引人误解的宣传', code: '8', totalCases: 0, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '9', sideCategory: '售后纠纷', indicatorName: '采用网络、电视、电话、邮购等方式销售商品，消费者依照法律规定有权自收到商品之日起七日内退货，经营者故意拖延或者无理拒绝', code: '9', totalCases: 0, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '10', sideCategory: '不公平条款', indicatorName: '采用格式条款、通知、声明、店堂告示等方式，作出排除或者限制消费者权利、减轻或者免除经营者责任、加重消费者责任等对消费者不公平、不合理的规定', code: '10', totalCases: 0, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '11', sideCategory: '其他行为', indicatorName: '法律、行政法规规定的其他侵害消费者权益的行为', code: '11', totalCases: 0, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '12', sideCategory: '个人信息保护', indicatorName: '侵害消费者个人信息依法得到保护的权利', code: '12', totalCases: 2, normalProc: 2, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0.55, confiscatedAmount: 0.55, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '13', sideCategory: '售后纠纷', indicatorName: '经营者以预收款方式提供商品或者服务，未按照约定提供', code: '13', totalCases: 0, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '14', sideCategory: '售后纠纷', indicatorName: '经营者提供商品或者服务，造成消费者财产损失，故意拖延或者无理拒绝消费者提出的修理、重作、更换、退货、补足商品和数量、退还货款和服务费用或者赔偿损失的要求', code: '14', totalCases: 0, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '15', sideCategory: '欺诈行为', indicatorName: '经营者提供商品或者服务有欺诈行为', code: '15', totalCases: 0, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '16', sideCategory: '虚假广告', indicatorName: '广告经营者、发布者设计、制作、发布虚假广告，造成消费者合法权益损害', code: '16', totalCases: 2, normalProc: 2, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0.4, confiscatedAmount: 0.4, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '17', sideCategory: '管理责任', indicatorName: '商品交易市场管理者、展销会举办者、柜台出租者、网络交易平台经营者，未履行法定职责，造成消费者合法权益损害', code: '17', totalCases: 0, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },

    // More rows... (simplified for brevity, showing structure)
    { key: '18', sideCategory: '其他行为', indicatorName: '从事修理、加工、安装、装饰装修等服务的经营者谎报用工用料，故意损坏、偷换零部件，损害消费者权益', code: '18', totalCases: 0, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '19', sideCategory: '其他行为', indicatorName: '从事房屋租赁、家政服务等中介服务的经营者提供虚假信息或者采取欺骗、恶意串通等手段损害消费者权益', code: '19', totalCases: 0, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '23', sideCategory: '虚假宣传', indicatorName: '通过虚假折价、虚构抽奖、假冒名义等方式进行虚假引人误解的宣传', code: '23', totalCases: 1, normalProc: 1, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0.002, confiscatedAmount: 0.0005, confiscatedIncome: 0.0015, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '25', sideCategory: '侵财、名誉', indicatorName: '擅自使用与他人有一定影响的商品名称、包装、装潢等相同或者近似的标识', code: '25', totalCases: 1, normalProc: 1, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '32', sideCategory: '管理责任', indicatorName: '经营者拒绝或者拖延有关行政部门责令对缺陷商品或者服务采取停止销售、警示、召回、无害化处理、销毁、停止生产或者服务等措施', code: '32', totalCases: 1, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '33', sideCategory: '管理责任', indicatorName: '经营者违反行政处罚决定书、未依法履行行政处罚决定义的', code: '33', totalCases: 1, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, confiscatedIncome: 0, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
    { key: '43', sideCategory: '其他', indicatorName: '上方统计数据以外的统计项', code: '43', totalCases: 10, normalProc: 0, simpleProc: 0, settledCases: 0, coreCases: 0, caseValue: 1, fineAmount: 23.94585, confiscatedAmount: 9.94605, confiscatedIncome: 13.9878, economicLossSaved: 0, seizureCount: 0, transferredCases: 0 },
];

const Component: React.FC = () => {
    const [reportType, setReportType] = useState('monthly');

    const columns: TableProps<ConsumerRightsData>['columns'] = [
        {
            title: '侵权行为分类',
            dataIndex: 'sideCategory',
            key: 'sideCategory',
            width: 120,
            align: 'center',
            onCell: (record) => {
                if (record.key === 'h1' || record.key === '1') return { colSpan: 1 };
                const category = record.sideCategory;
                const firstIdx = mockData.findIndex(item => item.sideCategory === category && item.key !== 'h1' && item.key !== '1');
                if (category && mockData[firstIdx].key === record.key) {
                    const count = mockData.filter(item => item.sideCategory === category).length;
                    return { rowSpan: count };
                }
                return { rowSpan: 0 };
            },
            render: (text, record) => (record.key === 'h1' || record.key === '1') ? null : text,
        },
        {
            title: '指标名称',
            dataIndex: 'indicatorName',
            key: 'indicatorName',
            width: 400,
            render: (text, record) => {
                const isSpecial = text === '甲' || text === '合计' || record.key === 'h1' || record.key === '1';
                return (
                    <div style={{
                        paddingLeft: isSpecial ? 0 : 12,
                        fontWeight: isSpecial ? 600 : 400,
                        textAlign: isSpecial ? 'center' : 'left',
                        color: isSpecial ? '#111827' : '#374151',
                        whiteSpace: 'pre-wrap',
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
            width: 70,
        },
        {
            title: '案件数',
            key: 'caseCounts',
            children: [
                {
                    title: '案件总数',
                    dataIndex: 'totalCases',
                    key: 'totalCases',
                    align: 'center',
                    render: (text, record) => {
                        if (record.key === 'h1' || text === 0 || text === '0') return text;
                        return <span className="clickable-value">{text}</span>;
                    }
                },
                {
                    title: '其中：普通程序',
                    dataIndex: 'normalProc',
                    key: 'normalProc',
                    align: 'center',
                    className: 'multi-line-header',
                },
                {
                    title: '简易程序',
                    dataIndex: 'simpleProc',
                    key: 'simpleProc',
                    align: 'center',
                },
                {
                    title: '结案且下达行政处罚决定书',
                    dataIndex: 'settledCases',
                    key: 'settledCases',
                    align: 'center',
                    className: 'multi-line-header',
                },
                {
                    title: '其中：核心案件',
                    dataIndex: 'coreCases',
                    key: 'coreCases',
                    align: 'center',
                    className: 'multi-line-header',
                }
            ]
        },
        {
            title: '案值',
            dataIndex: 'caseValue',
            key: 'caseValue',
            align: 'center',
        },
        {
            title: '罚款金额',
            dataIndex: 'fineAmount',
            key: 'fineAmount',
            align: 'center',
        },
        {
            title: '没收金额',
            dataIndex: 'confiscatedAmount',
            key: 'confiscatedAmount',
            align: 'center',
        },
        {
            title: '没收非法所得',
            dataIndex: 'confiscatedIncome',
            key: 'confiscatedIncome',
            align: 'center',
            className: 'multi-line-header',
        },
        {
            title: '挽回经济损失',
            dataIndex: 'economicLossSaved',
            key: 'economicLossSaved',
            align: 'center',
            className: 'multi-line-header',
        },
        {
            title: '查封扣押',
            dataIndex: 'seizureCount',
            key: 'seizureCount',
            align: 'center',
        },
        {
            title: '移送司法机关案件',
            dataIndex: 'transferredCases',
            key: 'transferredCases',
            align: 'center',
            className: 'multi-line-header',
            render: (text, record) => {
                if (record.key === 'h1' || text === 0 || text === '0') return text;
                return <span className="clickable-value">{text}</span>;
            }
        }
    ];

    return (
        <div className="page-container">
            <div className="content-wrapper" style={{ maxWidth: 1600 }}>
                <Title level={4} className="page-header-title">侵害消费者权益案件统计表（按行为分类）</Title>

                <Flex justify="space-between" align="center" className="filter-bar">
                    <Flex gap={24} align="center">
                        <Flex gap={8} align="center">
                            <span className="filter-label">办案机构：</span>
                            <Cascader
                                style={{ width: 240 }}
                                placeholder="请选择办案机构"
                                options={agencyData}
                                changeOnSelect
                                allowClear
                            />
                        </Flex>
                        <Flex gap={8} align="center">
                            <span className="filter-label">处罚决定日期：</span>
                            <RangePicker style={{ width: 280 }} />
                        </Flex>
                        <Radio.Group value={reportType} onChange={e => setReportType(e.target.value)}>
                            <Radio value="monthly">月报</Radio>
                            <Radio value="q1">季度报</Radio>
                            <Radio value="yearly">年报</Radio>
                        </Radio.Group>
                    </Flex>
                    <Flex gap={12}>
                        <Button type="primary" icon={<SearchOutlined />} className="btn-primary">查询</Button>
                        <Button icon={<ExportOutlined />}>导出</Button>
                    </Flex>
                </Flex>

                <div className="table-container">
                    <Table
                        columns={columns}
                        dataSource={mockData}
                        pagination={false}
                        bordered
                        size="small"
                        scroll={{ x: 1800 }}
                        rowClassName={(record) => record.key === 'h1' || record.key === '1' ? 'table-header-row' : ''}
                    />
                </div>
            </div>
        </div>
    );
};

export default Component;
