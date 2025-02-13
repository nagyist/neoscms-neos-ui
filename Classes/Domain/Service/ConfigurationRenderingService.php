<?php
namespace Neos\Neos\Ui\Domain\Service;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Eel\CompilingEvaluator;
use Neos\Eel\Utility;
use Neos\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 * @internal
 */
class ConfigurationRenderingService
{
    /**
     * @Flow\Inject(lazy=false)
     * @var CompilingEvaluator
     */
    protected $eelEvaluator;

    /**
     * @Flow\InjectConfiguration(package="Neos.Fusion", path="defaultContext")
     * @var array<string, string>
     */
    protected $fusionDefaultEelContext;

    /**
     * @Flow\InjectConfiguration(path="configurationDefaultEelContext")
     * @var array<string, string>
     */
    protected $additionalEelDefaultContext;

    /**
     * @param array<string|int, mixed> $configuration
     * @param array<string|int, mixed> $context
     * @return array<string|int, mixed>
     * @throws \Neos\Eel\Exception
     */
    public function computeConfiguration(array $configuration, array $context): array
    {
        $adjustedConfiguration = $configuration;
        $this->computeConfigurationInternally($adjustedConfiguration, $context);

        return $adjustedConfiguration;
    }

    /**
     * @param array<string|int, mixed> $adjustedConfiguration
     * @param array<string|int, mixed> $context
     * @throws \Neos\Eel\Exception
     */
    protected function computeConfigurationInternally(array &$adjustedConfiguration, array $context): void
    {
        foreach ($adjustedConfiguration as $key => &$value) {
            if (is_array($value)) {
                $this->computeConfigurationInternally($value, $context);
            } elseif (is_string($value) && substr($value, 0, 2) === '${' && substr($value, -1) === '}') {
                $value = Utility::evaluateEelExpression(
                    $value,
                    $this->eelEvaluator,
                    $context,
                    array_merge($this->fusionDefaultEelContext, $this->additionalEelDefaultContext)
                );
            }
        }
    }
}
